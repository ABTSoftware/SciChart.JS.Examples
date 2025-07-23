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
    EColumnYMode,
    EColumnMode,
    XyxyDataSeries,
    FastRectangleRenderableSeries,
    IRenderableSeries,
    parseColorToUIntArgb,
    EFillPaletteMode,
    IFillPaletteProvider,
} from "scichart";

const AUDIO_STREAM_BUFFER_SIZE = 2048;

export const getChartsInitializationApi = () => {
    let createGauge: (value: number, position: number, label: string) => void = function () {};
    let clearGauges: () => void;

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
        // fftDS.clear();
        // fftDS.appendRange(fftXValues, fftData);

        function calculateAverages(array: number[]) {
            // Check if array has exactly 1024 elements
            if (array.length !== 1024) {
                throw new Error("Array must have exactly 1024 elements");
            }

            const result = [];
            const groupSize = 128;

            // Process each group of 128 elements
            for (let i = 0; i < array.length; i += groupSize) {
                const group = array.slice(i, i + groupSize);
                const sum = group.reduce((acc: any, val: any) => acc + val, 0);
                const average = sum / groupSize;
                result.push(average);
            }

            return result;
        }

        // function findMinMax(array: number[]) {
        //     if (array.length === 0) {
        //         throw new Error("Array cannot be empty");
        //     }

        //     return JSON.stringify([Math.min(...array), Math.max(...array)]);
        // }

        // const averages = calculateAverages(fftData);

        let calculateValues = [
            (fftData[1] + fftData[2] + fftData[3]) / 3,
            (fftData[4] + fftData[5] + fftData[6]) / 3,
            (fftData[10] + fftData[11] + fftData[12]) / 3,
            (fftData[21] + fftData[22] + fftData[23] + fftData[24]) / 4,
            (fftData[44] + fftData[45] + fftData[46] + fftData[47] + fftData[48]) / 5,
            (fftData[90] + fftData[91] + fftData[92] + fftData[93] + fftData[94]) / 5,
            (fftData[183] + fftData[184] + fftData[185] + fftData[186] + fftData[187]) / 5,
            (fftData[369] + fftData[370] + fftData[371] + fftData[372] + fftData[373]) / 5,
            (fftData[740] + fftData[741] + fftData[742] + fftData[743] + fftData[744]) / 5,
            (fftData[1019] + fftData[1020] + fftData[1021] + fftData[1022] + fftData[1023]) / 5,
        ];

        let frequencies = ["62Hz", "125Hz", "250Hz", "500Hz", "1Khz", "2Khz", "4Khz", "8Khz", "16Khz", "22Khz"];


        // calculateValues

        clearGauges();

        calculateValues
            .map((d) => d / 2 - 10)
            .forEach((d, i) => {
                createGauge(d, i, frequencies[i]);
            });
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
        const columnYValues = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const GRADIENT_COLOROS = [
            "#1C5727",
            "#277B09",
            "#2C8A26",
            "#3CAC45",
            "#58FF80",
            "#59FD03",
            "#7FFC09",
            "#98FA96",
            "#AEFE2E",
            "#FEFCD2",
            "#FBFF09",
            "#FBD802",
            "#F9A700",
            "#F88B01",
            "#F54602",
            "#F54702",
            "#F50E02",
            "#DA153D",
            "#B22122",
            "#B22122",
        ];

        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        const growByX = new NumberRange(0.01, 0.01);
        const growByY = new NumberRange(0.1, 0.05);

        // Create XAxis / YAxis
        const xAxis = new NumericAxis(wasmContext, {
            // axisTitle: "X Axis",
            isVisible: false,
            growBy: growByX,
        });

        const yAxis = new NumericAxis(wasmContext, {
            // axisTitle: "Y Axis",
            // isVisible: false,
            growBy: growByY,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        class RectangleFillPaletteProvider implements IFillPaletteProvider {
            public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;

            private readonly colors: number[];

            constructor(colorStrings: string[]) {
                // Convert hex color strings to ARGB numbers
                this.colors = colorStrings.map((color) => parseColorToUIntArgb(color));
            }

            public onAttached(parentSeries: IRenderableSeries): void {
                // Called when the palette provider is attached to a series
                // You can store reference to the parent series if needed
            }

            public onDetached(): void {
                // Called when the palette provider is detached
                // Clean up any resources if needed
            }

            public overrideFillArgb(
                xValue: number,
                yValue: number,
                index: number,
                opacity?: number,
                metadata?: any
            ): number | undefined {
                let color = this.colors[index - 1];

                // Return different color based on index
                return color;
            }
        }

        clearGauges = () => {
            sciChartSurface.renderableSeries.clear();
            sciChartSurface.annotations.clear();
        };

        createGauge = (value: number, position: number, label: string) => {
            const rectangleData = columnYValues
                .filter((d) => d <= value)
                .map((d, i) => {
                    const width = 10;
                    if (i === 0) {
                        return [position * 20, 0, width + position * 20, d];
                    }
                    return [position * 20, columnYValues[i - 1], width + position * 20, d];
                });

            const rectangleOutlineData = columnYValues.map((d, i) => {
                const width = 10;
                if (i === 0) {
                    return [position * 20, 0, width + position * 20, d];
                }
                return [position * 20, columnYValues[i - 1], width + position * 20, d];
            });

            const xValues = rectangleData.map((d) => d[0]);
            const yValues = rectangleData.map((d) => d[1]);
            const x1Values = rectangleData.map((d) => d[2]);
            const y1Values = rectangleData.map((d) => d[3]);

            const xValuesOutline = rectangleOutlineData.map((d) => d[0]);
            const yValuesOutline = rectangleOutlineData.map((d) => d[1]);
            const x1ValuesOutline = rectangleOutlineData.map((d) => d[2]);
            const y1ValuesOutline = rectangleOutlineData.map((d) => d[3]);

            const backgroundRectangle = new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: [-2 + position * 20],
                    yValues: [-10.5],
                    x1Values: [12 + position * 20],
                    y1Values: [10.5],
                }),
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                fill: appTheme.DarkIndigo, //appTheme.DarkIndigo,
                strokeThickness: 2,
                stroke: "gray", //appTheme.DarkIndigo
            });

            const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues,
                    yValues,
                    x1Values,
                    y1Values,
                }),
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                stroke: appTheme.DarkIndigo,
                strokeThickness: 4,
                paletteProvider: new RectangleFillPaletteProvider(GRADIENT_COLOROS),
                fill: "#ffffff00",
            });

            const rectangleOutlineSeries = new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyxyDataSeries(wasmContext, {
                    xValues: xValuesOutline,
                    yValues: yValuesOutline,
                    x1Values: x1ValuesOutline,
                    y1Values: y1ValuesOutline,
                }),
                columnXMode: EColumnMode.StartEnd,
                columnYMode: EColumnYMode.TopBottom,
                stroke: appTheme.DarkIndigo,
                strokeThickness: 0,
                fill: "#ffffff00",
            });

            const annotation = new TextAnnotation({
                x1: 5.5 + position * 20,
                y1: -11,
                text: label, //yVal.toString(),
                fontSize: 12,
                textColor: "#FFFFFF",
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
            });

            sciChartSurface.renderableSeries.add(backgroundRectangle, rectangleSeries, rectangleOutlineSeries);
            sciChartSurface.annotations.add(annotation);
        };

        return { sciChartSurface, createGauge };
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

    return { initAudioChart, initFftChart, onAllChartsInit };
};
