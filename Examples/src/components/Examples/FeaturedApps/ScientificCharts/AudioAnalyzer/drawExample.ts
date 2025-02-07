import { AudioDataProvider } from "./AudioDataProvider";
import { Radix2FFT } from "./Radix2FFT";
import { appTheme } from "../../../theme";
import {
    XyDataSeries,
    UniformHeatmapDataSeries,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    SciChartSurface,
    NumericAxis,
    EAutoRange,
    NumberRange,
    FastLineRenderableSeries,
    LogarithmicAxis,
    ENumericFormat,
    EAxisAlignment,
    FastMountainRenderableSeries,
    EllipsePointMarker,
    PaletteFactory,
    GradientParams,
    Point,
    UniformHeatmapRenderableSeries,
    HeatmapColorMap,
} from "scichart";

const AUDIO_STREAM_BUFFER_SIZE = 2048;

export const getChartsInitializationApi = () => {
    const dataProvider = new AudioDataProvider();

    const bufferSize = dataProvider.bufferSize;
    const sampleRate = dataProvider.sampleRate;

    const fft = new Radix2FFT(bufferSize);

    const hzPerDataPoint = sampleRate / bufferSize;
    const fftSize = fft.fftSize;
    const fftCount = 200;

    let fftXValues: number[];
    let spectrogramValues: number[][];

    let audioDS: XyDataSeries;
    let historyDS: XyDataSeries;
    let fftDS: XyDataSeries;
    let spectrogramDS: UniformHeatmapDataSeries;

    let hasAudio: boolean;

    const helpText = new TextAnnotation({
        x1: 0,
        y1: 0,
        xAxisId: "history",
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        text: "This example requires microphone permissions.  Please click Allow in the popup.",
        textColor: "#FFFFFF88",
    });

    function updateAnalysers(frame: number): void {
        // Make sure Audio is initialized
        if (dataProvider.initialized === false) {
            return;
        }

        // Get audio data
        const audioData = dataProvider.next();

        // Update Audio Chart. When fifoCapacity is set, data automatically scrolls
        audioDS.appendRange(audioData.xData, audioData.yData);

        // Update History. When fifoCapacity is set, data automatically scrolls
        historyDS.appendRange(audioData.xData, audioData.yData);

        // Perform FFT
        const fftData = fft.run(audioData.yData);

        // Update FFT Chart. Clear() and appendRange() is a fast replace for data (if same size)
        fftDS.clear();
        fftDS.appendRange(fftXValues, fftData);

        // Update Spectrogram Chart
        spectrogramValues.shift();
        spectrogramValues.push(fftData);
        spectrogramDS.setZValues(spectrogramValues);
    }

    // AUDIO CHART
    const initAudioChart = async (rootElement: string | HTMLDivElement) => {
        // Create a chart for the audio
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        // Create an XAxis for the live audio
        const xAxis = new NumericAxis(wasmContext, {
            id: "audio",
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
        });
        sciChartSurface.xAxes.add(xAxis);

        // Create an XAxis for the history of the audio on the same chart
        const xhistAxis = new NumericAxis(wasmContext, {
            id: "history",
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorTickLines: false,
        });
        sciChartSurface.xAxes.add(xhistAxis);

        // Create a YAxis for the audio data
        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-32768 * 0.8, 32767 * 0.8), // [short.MIN. short.MAX]
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
        });
        sciChartSurface.yAxes.add(yAxis);

        // Initializing a series with fifoCapacity enables scrolling behaviour and auto discarding old data
        audioDS = new XyDataSeries(wasmContext, { fifoCapacity: AUDIO_STREAM_BUFFER_SIZE });

        // Fill the data series with zero values
        for (let i = 0; i < AUDIO_STREAM_BUFFER_SIZE; i++) {
            audioDS.append(0, 0);
        }

        // Add a line series for the live audio data
        // using XAxisId=audio for the live audio trace scaling
        const rs = new FastLineRenderableSeries(wasmContext, {
            xAxisId: "audio",
            stroke: "#4FBEE6",
            strokeThickness: 2,
            dataSeries: audioDS,
        });

        sciChartSurface.renderableSeries.add(rs);

        // Initializing a series with fifoCapacity enables scrolling behaviour and auto discarding old data.
        historyDS = new XyDataSeries(wasmContext, { fifoCapacity: AUDIO_STREAM_BUFFER_SIZE * fftCount });
        for (let i = 0; i < AUDIO_STREAM_BUFFER_SIZE * fftCount; i++) {
            historyDS.append(0, 0);
        }

        // Add a line series for the historical audio data
        // using the XAxisId=history for separate scaling for this trace
        const histrs = new FastLineRenderableSeries(wasmContext, {
            stroke: "#208EAD33",
            strokeThickness: 1,
            opacity: 0.5,
            xAxisId: "history",
            dataSeries: historyDS,
        });
        sciChartSurface.renderableSeries.add(histrs);

        // Add instructions
        sciChartSurface.annotations.add(helpText);

        hasAudio = await dataProvider.initAudio();

        return { sciChartSurface };
    };

    // FFT CHART
    const initFftChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });
        const xAxis = new LogarithmicAxis(wasmContext, {
            logBase: 10,
            labelFormat: ENumericFormat.SignificantFigures,
            maxAutoTicks: 5,
            axisTitleStyle: { fontSize: 10 },
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(0, 80),
            growBy: new NumberRange(0.1, 0.1),
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0,
            axisTitleStyle: { fontSize: 10 },
        });
        sciChartSurface.yAxes.add(yAxis);

        fftDS = new XyDataSeries(wasmContext);
        fftXValues = new Array<number>(fftSize);
        for (let i = 0; i < fftSize; i++) {
            fftXValues[i] = (i + 1) * hzPerDataPoint;
        }

        // Make a column chart with a gradient palette on the stroke only
        const rs = new FastMountainRenderableSeries(wasmContext, {
            dataSeries: fftDS,
            pointMarker: new EllipsePointMarker(wasmContext, { width: 9, height: 9 }),
            strokeThickness: 3,
            paletteProvider: PaletteFactory.createGradient(
                wasmContext,
                new GradientParams(new Point(0, 0), new Point(1, 1), [
                    { offset: 0, color: "#36B8E6" },
                    { offset: 0.001, color: "#5D8CC2" },
                    { offset: 0.01, color: "#8166A2" },
                    { offset: 0.1, color: "#AE418C" },
                    { offset: 1.0, color: "#CA5B79" },
                ]),
                {
                    enableStroke: true,
                    enableFill: true,
                    enablePointMarkers: true,
                    fillOpacity: 0.17,
                    pointMarkerOpacity: 0.37,
                }
            ),
        });
        sciChartSurface.renderableSeries.add(rs);

        return { sciChartSurface };
    };

    // SPECTROGRAM CHART
    const initSpectogramChart = async (rootElement: string | HTMLDivElement) => {
        spectrogramValues = new Array<number[]>(fftCount);
        for (let i = 0; i < fftCount; i++) {
            spectrogramValues[i] = new Array<number>(fftSize);
            for (let j = 0; j < fftSize; j++) {
                spectrogramValues[i][j] = 0;
            }
        }

        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        const xAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
        });
        sciChartSurface.yAxes.add(yAxis);

        spectrogramDS = new UniformHeatmapDataSeries(wasmContext, {
            xStart: 0,
            xStep: 1,
            yStart: 0,
            yStep: 1,
            zValues: spectrogramValues,
        });

        const rs = new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: spectrogramDS,
            colorMap: new HeatmapColorMap({
                minimum: 0,
                maximum: 70,
                gradientStops: [
                    { offset: 0, color: "#000000" },
                    { offset: 0.25, color: "#800080" },
                    { offset: 0.5, color: "#FF0000" },
                    { offset: 0.75, color: "#FFFF00" },
                    { offset: 1, color: "#FFFFFF" },
                ],
            }),
        });
        sciChartSurface.renderableSeries.add(rs);

        return { sciChartSurface };
    };

    const onAllChartsInit = () => {
        if (!hasAudio) {
            console.log("dataProvider", dataProvider);
            if (dataProvider.permissionError) {
                helpText.text =
                    "We were not able to access your microphone.  This may be because you did not accept the permissions.  Open your browser security settings and remove the block on microphone permissions from this site, then reload the page.";
            } else if (!window.isSecureContext) {
                helpText.text = "Cannot get microphone access if the site is not localhost or on https";
            } else {
                helpText.text = "There was an error trying to get microphone access.  Check the console";
            }

            return { startUpdate: () => {}, stopUpdate: () => {}, cleanup: () => {} };
        } else {
            helpText.text = "This example uses your microphone to generate waveforms. Say something!";

            // START ANIMATION

            let frameCounter = 0;
            const updateChart = () => {
                if (!dataProvider.isDeleted) {
                    updateAnalysers(frameCounter++);
                }
            };

            let timerId: NodeJS.Timeout;

            const startUpdate = () => {
                timerId = setInterval(updateChart, 20);
            };

            const stopUpdate = () => {
                clearInterval(timerId);
            };

            const cleanup = () => {
                dataProvider.closeAudio();
            };

            return { startUpdate, stopUpdate, cleanup };
        }
    };

    return { initAudioChart, initFftChart, initSpectogramChart, onAllChartsInit };
};
