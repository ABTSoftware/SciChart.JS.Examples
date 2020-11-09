import { UniformHeatmapDataSeries } from "scichart/Charting/Model/UniformHeatmapDataSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { UniformHeatmapRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { AudioDataProvider } from "./AudioDataProvider";
import { Radix2FFT } from "./Radix2FFT";

export const divElementIdAudioChart = "sciChart1";
export const divElementIdFttChart = "sciChart2";
export const divElementIdChart3 = "sciChart3";

export const TOP_CHART_WIDTH = 600;
export const TOP_CHART_HEIGHT = 420;
export const BOTTOM_CHART_WIDTH = 300;
export const BOTTOM_CHART_HEIGHT = 200;

const AUDIO_STREAM_BUFFER_SIZE = 2048;

let cleanupRequested: boolean;

export const drawExample = async () => {
    cleanupRequested = false;

    const dataProvider = new AudioDataProvider();

    const bufferSize = dataProvider.bufferSize;
    const sampleRate = dataProvider.sampleRate;

    const fft = new Radix2FFT(bufferSize);

    const hzPerDataPoint = sampleRate / bufferSize;
    const fftSize = fft.fftSize;
    const fftCount = BOTTOM_CHART_HEIGHT;

    let fftXValues: number[];
    let spectrogramValues: number[][];

    let audioDS: XyDataSeries;
    let fftDS: XyDataSeries;
    let spectrogramDS: UniformHeatmapDataSeries;

    // INIT AUDIO
    const initAudio = async () => {
        if (dataProvider.initAudio() === false) {
            throw new Error("Can't initialize audio!");
        }
    };

    function updateAnalysers(frame: number): void {
        // Make sure Audio is initialized
        if (dataProvider.initialized === false) {
            return;
        }

        // Get audio data
        const audioData = dataProvider.next();

        // Update Audio Chart
        audioDS.removeRange(0, audioData.pointsCount);
        audioDS.appendRange(audioData.xData, audioData.yData);

        // Perfrom FFT
        const fftData = fft.run(audioData.yData);

        // Update FFT Chart
        // TODO: fftDS.updateRangeYAt(0, fftData);
        fftDS.clear();
        fftDS.appendRange(fftXValues, fftData);

        // Update Spectrogram Chart
        spectrogramValues.shift();
        spectrogramValues.push(fftData);
        spectrogramDS.setZValues(spectrogramValues);
    }

    // AUDIO CHART
    const initAudioChart = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(
            divElementIdAudioChart,
            TOP_CHART_WIDTH,
            TOP_CHART_HEIGHT
        );
        const xAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
            // TODO: drawMajorBands: false
            // TODO: drawMinorGridLines: false
            // TODO: drawMajorGridLines: false
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-32768, 32767), // [short.MIN. short.MAX]
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
            // TODO: drawMajorBands: false
            // TODO: drawMinorGridLines: false
            // TODO: drawMajorGridLines: false
        });
        sciChartSurface.yAxes.add(yAxis);

        audioDS = new XyDataSeries(wasmContext);

        // Fill the data series with zero values
        for (let i = 0; i < AUDIO_STREAM_BUFFER_SIZE; i++) {
            audioDS.append(0, 0);
        }

        const rs = new FastLineRenderableSeries(wasmContext, {
            stroke: "#808080",
            strokeThickness: 1,
            dataSeries: audioDS
        });

        sciChartSurface.renderableSeries.add(rs);
    };

    // FFT CHART
    const initFftChart = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(
            divElementIdFttChart,
            BOTTOM_CHART_WIDTH,
            BOTTOM_CHART_HEIGHT
        );
        const xAxis = new NumericAxis(wasmContext, {
            drawMajorTickLines: false,
            maxAutoTicks: 5,
            axisTitle: "Hz"
            // TODO: axisTitlePlacement: Right
            // TODO: axisTitleOrientation: Horizontal
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-30, 70),
            growBy: new NumberRange(0.1, 0.1),
            drawMinorTickLines: false,
            // TODO: drawMinorGridLines: false,
            drawMajorTickLines: false,
            axisTitle: "dB"
            // TODO: axisTitlePlacement: Top
            // TODO: axisTitleOrientation: Horizontal
        });
        sciChartSurface.yAxes.add(yAxis);

        fftDS = new XyDataSeries(wasmContext);
        fftXValues = new Array<number>(fftSize);
        for (let i = 0; i < fftSize; i++) {
            fftXValues[i] = i * hzPerDataPoint;
        }

        const rs = new FastColumnRenderableSeries(wasmContext, {
            stroke: "#E6E6FA",
            dataSeries: fftDS,
            // TODO: paletteProvider = new FFTPaletteProvider(),
            zeroLineY: -30
        });
        sciChartSurface.renderableSeries.add(rs);
    };

    // SPECTROGRAM CHART
    const initSpectogramChart = async () => {
        spectrogramValues = new Array<number[]>(fftCount);
        for (let i = 0; i < fftCount; i++) {
            spectrogramValues[i] = new Array<number>(fftSize);
            for (let j = 0; j < fftSize; j++) {
                spectrogramValues[i][j] = 0;
            }
        }

        const { sciChartSurface, wasmContext } = await SciChartSurface.create(
            divElementIdChart3,
            BOTTOM_CHART_WIDTH,
            BOTTOM_CHART_HEIGHT
        );

        const xAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
            // TODO: drawMajorBands: false,
            // TODO: drawMinorGridLines: false,
            // TODO: drawMajorGridLines: false,
            // TODO: axisAlignment: EAxisAlignment.Left
            // TODO: flipCoordinates: true
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
            // TODO: drawMajorBands: false,
            // TODO: drawMinorGridLines: false,
            // TODO: drawMajorGridLines: false,
            // TODO: axisAlignment: EAxisAlignment.Bottom
            // TODO: flipCoordinates: true
        });
        sciChartSurface.yAxes.add(yAxis);

        spectrogramDS = new UniformHeatmapDataSeries(wasmContext, 0, 1, 0, 1, spectrogramValues);

        const rs = new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: spectrogramDS,
            colorMap: new HeatmapColorMap({
                minimum: -30,
                maximum: 70,
                gradientStops: [
                    { offset: 0, color: "#000000" },
                    { offset: 0.0001, color: "#00008B" },
                    { offset: 0.25, color: "#800080" },
                    { offset: 0.5, color: "#FF0000" },
                    { offset: 0.75, color: "#FFFF00" },
                    { offset: 1, color: "#FFFFFF" }
                ]
            })
        });
        sciChartSurface.renderableSeries.add(rs);
    };

    // CLEANUP
    const cleanup = async () => {
        dataProvider.closeAudio();
    };

    // DRAW CHARTS
    await initAudioChart();
    await initFftChart();
    await initSpectogramChart();

    // INIT AUDIO
    await initAudio();

    // START ANIMATION
    let timerId: NodeJS.Timeout;
    let frameCounter = 0;
    const updateChart = () => {
        if (cleanupRequested === true) {
            cleanup();
        } else {
            updateAnalysers(frameCounter++);
            timerId = setTimeout(updateChart, 20);
        }
    };
    updateChart();
};

export const requestCleanup = async () => {
    cleanupRequested = true;
};
