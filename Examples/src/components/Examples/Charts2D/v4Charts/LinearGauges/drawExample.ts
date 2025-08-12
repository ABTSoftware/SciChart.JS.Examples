import {
    NumberRange,
    TextAnnotation,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    GradientParams,
    Point,
    XyxyDataSeries,
    EColumnMode,
    EColumnYMode,
    SciChartSurface,
    NumericAxis,
    FastRectangleRenderableSeries,
    parseColorToUIntArgb,
    IFillPaletteProvider,
    EFillPaletteMode,
    IRenderableSeries,
    LineArrowAnnotation,
    EArrowHeadPosition,
    DataLabelProvider,
    EAxisAlignment,
    Thickness,
    XyyDataSeries,
    EDataPointWidthMode,
    DefaultPaletteProvider,
} from "scichart";
import { appTheme } from "../../../theme";

export const getChartsInitializationAPI = () => {
    const gauge1 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        const growByX = new NumberRange(2, 2);
        const growByY = new NumberRange(0.05, 0.05);

        // Create XAxis / YAxis
        const xAxis = new NumericAxis(wasmContext, {
            // axisTitle: "X Axis",
            isVisible: false,
            growBy: growByX,
        });

        const yAxis = new NumericAxis(wasmContext, {
            // axisTitle: "Y Axis",
            isVisible: false,
            growBy: growByY,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        const columnYValues = [50, 70, 80, 90, 100];

        const GRADIENT_COLORS = [
            appTheme.VividPink,
            appTheme.VividOrange,
            appTheme.VividTeal,
            appTheme.Indigo,
            appTheme.DarkIndigo,
        ];

        const rectangleData = columnYValues.map((d, i) => {
            const width = 10;
            if (i === 0) {
                return [0, 0, width, d];
            }
            return [0, columnYValues[i - 1], width, d];
        });

        const xValues = rectangleData.map((d) => d[0]);
        const yValues = rectangleData.map((d) => d[1]);
        const x1Values = rectangleData.map((d) => d[2]);
        const y1Values = rectangleData.map((d) => d[3]);

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
                // Return different color based on index
                return this.colors[index % this.colors.length];
            }
        }

        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues,
                yValues,
                x1Values,
                y1Values,
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.ForegroundColor,
            strokeThickness: 0.5,
            paletteProvider: new RectangleFillPaletteProvider(GRADIENT_COLORS),
        });
        sciChartSurface.renderableSeries.add(rectangleSeries);

        [0, ...columnYValues].forEach((yVal, i) => {
            const label = new TextAnnotation({
                x2: 8,
                x1: -1,

                y1: yVal,
                y2: yVal,
                text: yVal.toString(),
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
            });
            sciChartSurface.annotations.add(label);
        });

        const markerPosition = (value: number) => {
            const arrowLine = new LineArrowAnnotation({
                x1: 10,
                y1: value,
                x2: 11,
                y2: value,
                isArrowHeadScalable: true, // the arrow head will scale with the visibleRange
                arrowStyle: {
                    headLength: 10,
                    headWidth: 7,
                    headDepth: 1,
                    fill: appTheme.ForegroundColor,
                    strokeThickness: 1,
                },
                stroke: appTheme.ForegroundColor,
                strokeThickness: 2,
                arrowHeadPosition: EArrowHeadPosition.Start, // only show arrow head at the end
            });

            const arrowLabel = new TextAnnotation({
                x1: 13,
                y1: value,
                x2: 8,
                y2: 0,
                text: `${value}`,
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
            });
            sciChartSurface.annotations.add(arrowLine, arrowLabel);
        };

        // set position of marker
        markerPosition(60);

        return { sciChartSurface, wasmContext };
    };

    const gauge2 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
            padding: new Thickness(5, 50, 5, 70),
        });

        // Create XAxis / YAxis
        const xAxis = new NumericAxis(wasmContext, {
            isVisible: false,
            growBy: new NumberRange(0, 1),
        });

        const yAxis = new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05),
            drawMajorBands: false,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            majorGridLineStyle: { color: appTheme.ForegroundColor },
            majorTickLineStyle: { color: appTheme.ForegroundColor },
            overrideOffset: 0,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: [0],
                yValues: [0],
                x1Values: [10],
                y1Values: [100],
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.ForegroundColor,
            strokeThickness: 1,

            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { offset: 0, color: appTheme.VividPink },
                { offset: 0.5, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.VividTeal },
                { offset: 0.8, color: appTheme.Indigo },
                { offset: 1, color: appTheme.DarkIndigo },
            ]),
        });

        sciChartSurface.renderableSeries.add(rectangleSeries);

        const markerPosition = (value: number) => {
            const arrowLine = new LineArrowAnnotation({
                x1: 10,
                y1: value,
                x2: 11,
                y2: value,
                isArrowHeadScalable: true, // the arrow head will scale with the visibleRange
                arrowStyle: {
                    headLength: 10,
                    headWidth: 7,
                    headDepth: 1,
                    fill: appTheme.ForegroundColor,
                    strokeThickness: 1,
                },
                stroke: appTheme.ForegroundColor,
                strokeThickness: 2,
                arrowHeadPosition: EArrowHeadPosition.Start, // only show arrow head at the end
            });

            const arrowLabel = new TextAnnotation({
                x1: 13,
                y1: value,
                x2: 8,
                y2: 0,
                text: `${value}`,
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
            });
            sciChartSurface.annotations.add(arrowLine, arrowLabel);
        };

        markerPosition(60);

        return { sciChartSurface, wasmContext };
    };

    const gauge3 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        const growByY = new NumberRange(3, 3);
        const growByX = new NumberRange(0.05, 0.05);

        // Create XAxis / YAxis
        const xAxis = new NumericAxis(wasmContext, {
            // axisTitle: "X Axis",
            isVisible: false,
            growBy: growByX,
        });

        const yAxis = new NumericAxis(wasmContext, {
            // axisTitle: "Y Axis",
            isVisible: false,
            growBy: growByY,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // const columnYValues = [50, 70, 80, 90, 100];
        const columnYValues = [33, 66, 100];

        const GRADIENT_COLORS = [appTheme.VividGreen, appTheme.VividOrange, appTheme.VividRed];

        const rectangleData = columnYValues.map((d, i) => {
            const height = 10;
            if (i === 0) {
                return [0, 0, d, height];
            }
            return [columnYValues[i - 1], 0, d, height];
        });

        const xValues = rectangleData.map((d) => d[0]);
        const yValues = rectangleData.map((d) => d[1]);
        const x1Values = rectangleData.map((d) => d[2]);
        const y1Values = rectangleData.map((d) => d[3]);

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
                // Return different color based on index
                return this.colors[index % this.colors.length];
            }
        }

        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues,
                yValues,
                x1Values,
                y1Values,
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.ForegroundColor,
            strokeThickness: 0.1,
            paletteProvider: new RectangleFillPaletteProvider(GRADIENT_COLORS),
            dataLabels: {
                style: { fontFamily: "Arial", fontSize: 12 },
                color: appTheme.ForegroundColor,
            },
        });

        const labels: string[] = ["Low", "Moderate", "High"];

        (rectangleSeries.dataLabelProvider as DataLabelProvider).getText = (state) => {
            // Return custom text for each rectangle
            return labels[state.index];
        };

        sciChartSurface.renderableSeries.add(rectangleSeries);

        [0, ...columnYValues].forEach((yVal, i) => {
            const label = new TextAnnotation({
                x1: yVal,
                x2: yVal,
                y1: -1,
                y2: -1,
                text: yVal.toString(),
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
            });
            sciChartSurface.annotations.add(label);
        });

        const markerPosition = (value: number) => {
            const arrowLine = new LineArrowAnnotation({
                y1: 10,
                x1: value,
                y2: 11,
                x2: value,
                isArrowHeadScalable: true, // the arrow head will scale with the visibleRange
                arrowStyle: {
                    headLength: 10,
                    headWidth: 7,
                    headDepth: 1,
                    fill: appTheme.ForegroundColor,
                    strokeThickness: 1,
                },
                stroke: appTheme.ForegroundColor,
                strokeThickness: 2,
                arrowHeadPosition: EArrowHeadPosition.Start, // only show arrow head at the end
            });

            const arrowLabel = new TextAnnotation({
                y1: 13,
                x1: value,
                y2: 8,
                x2: 0,
                text: `${value}`,
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            });
            sciChartSurface.annotations.add(arrowLine, arrowLabel);
        };

        markerPosition(90);

        return { sciChartSurface, wasmContext };
    };

    const gauge4 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        const growByX = new NumberRange(1.5, 1.5);
        const growByY = new NumberRange(0.05, 0.05);

        // Create XAxis / YAxis
        const xAxis = new NumericAxis(wasmContext, {
            // axisTitle: "X Axis",
            isVisible: false,
            growBy: growByX,
        });

        const yAxis = new NumericAxis(wasmContext, {
            // axisTitle: "Y Axis",
            isVisible: false,
            growBy: growByY,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        const value = 500;

        const columnYValues = [350, 600, 700, 800, 850];

        const GRADIENT_COLORS = [
            appTheme.VividPink,
            appTheme.VividOrange,
            appTheme.VividGreen,
            appTheme.Indigo,
            appTheme.DarkIndigo,
        ];

        const rectangleData = columnYValues.map((d, i) => {
            const width = 2;
            if (i === 0) {
                return [0, 0, width, d];
            }
            return [0, columnYValues[i - 1], width, d];
        });

        const xValues = rectangleData.map((d) => d[0]);
        const yValues = rectangleData.map((d) => d[1]);
        const x1Values = rectangleData.map((d) => d[2]);
        const y1Values = rectangleData.map((d) => d[3]);

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
                // Return different color based on index
                return this.colors[index % this.colors.length];
            }
        }

        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues,
                yValues,
                x1Values,
                y1Values,
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.ForegroundColor,
            // opacity: 0,
            strokeThickness: 0.5,
            paletteProvider: new RectangleFillPaletteProvider(GRADIENT_COLORS),
        });
        sciChartSurface.renderableSeries.add(rectangleSeries);

        [0, ...columnYValues].forEach((yVal, i) => {
            const label = new TextAnnotation({
                x2: 8,
                x1: -1,
                y1: yVal,
                y2: yVal,
                text: yVal.toString(),
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
            });
            sciChartSurface.annotations.add(label);
        });

        const rectangleSeriesOutline = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: [3],
                yValues: [0],
                x1Values: [13],
                y1Values: [850],
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.ForegroundColor,
            strokeThickness: 0.5,
            fill: appTheme.ForegroundColor + "00",
        });

        const setColor = (valu: number) => {
            return value < 350
                ? GRADIENT_COLORS[0]
                : value < 600
                ? GRADIENT_COLORS[1]
                : value < 700
                ? GRADIENT_COLORS[2]
                : value < 800
                ? GRADIENT_COLORS[3]
                : GRADIENT_COLORS[4];
        };

        const rectangleValue = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: [3],
                yValues: [0],
                x1Values: [13],
                y1Values: [value],
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.ForegroundColor,
            opacity: 1,
            fill: setColor(value),
            strokeThickness: 0,
        });
        sciChartSurface.renderableSeries.add(rectangleValue, rectangleSeriesOutline);

        const label = new TextAnnotation({
            x1: 13.5,
            y1: value,
            x2: value,
            y2: 0,
            text: value.toString(),
            fontSize: 12,
            textColor: appTheme.ForegroundColor,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
        });
        sciChartSurface.annotations.add(label);

        return { sciChartSurface, wasmContext };
    };

    const gauge5 = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
        });

        const growByY = new NumberRange(3, 3);
        const growByX = new NumberRange(0.05, 0.05);

        const xAxis = new NumericAxis(wasmContext, {
            isVisible: false,
            growBy: growByX,
        });

        const yAxis = new NumericAxis(wasmContext, {
            isVisible: false,
            growBy: growByY,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        const value = 23;

        const columnXValues = [5, 10, 15, 20, 25, 30];

        const GRADIENT_COLORS = [appTheme.VividGreen, appTheme.VividOrange, appTheme.VividRed];

        const rectangleData = columnXValues.map((d, i) => {
            const height = 10;
            if (i === 0) {
                return [0, 0, d, height];
            }
            return [columnXValues[i - 1], 0, d, height];
        });

        const xValues = rectangleData.map((d) => d[0]);
        const yValues = rectangleData.map((d) => d[1]);
        const x1Values = rectangleData.map((d) => d[2]);
        const y1Values = rectangleData.map((d) => d[3]);

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
                // Return different color based on index
                return columnXValues[index] <= 20
                    ? parseColorToUIntArgb(appTheme.VividGreen)
                    : parseColorToUIntArgb(appTheme.VividRed);
            }
        }

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
            strokeThickness: 0.1,
            paletteProvider: new RectangleFillPaletteProvider(GRADIENT_COLORS),
        });

        const valueLine = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries: new XyxyDataSeries(wasmContext, {
                xValues: [0],
                yValues: [11],
                x1Values: [value],
                y1Values: [12],
            }),
            columnXMode: EColumnMode.StartEnd,
            columnYMode: EColumnYMode.TopBottom,
            stroke: appTheme.DarkIndigo,
            strokeThickness: 0.1,
            fill: appTheme.MutedSkyBlue,
        });
        sciChartSurface.renderableSeries.add(rectangleSeries, valueLine);

        [0, ...columnXValues].forEach((yVal, i) => {
            const label = new TextAnnotation({
                x1: yVal,
                x2: yVal,
                y1: -1,
                y2: -1,
                text: yVal.toString(),
                fontSize: 12,
                textColor: appTheme.ForegroundColor,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Top,
            });
            sciChartSurface.annotations.add(label);
        });

        const arrowLabel = new TextAnnotation({
            y1: 13,
            x1: 60,
            y2: 8,
            x2: 0,
            text: "60",
            fontSize: 12,
            textColor: appTheme.ForegroundColor,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        });
        sciChartSurface.annotations.add(arrowLabel);

        return { sciChartSurface, wasmContext };
    };

    const gauge6 = async (rootElement: string | HTMLDivElement) => {
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
            padding: new Thickness(5, 5, 5, 20),
        });

        const growByY = new NumberRange(0.05, 0.05);

        // Create XAxis / YAxis
        const xAxis = new NumericAxis(wasmContext, {
            isVisible: false,
            visibleRange: new NumberRange(-20, 30),
        });

        const yAxis = new NumericAxis(wasmContext, {
            isVisible: true,
            growBy: growByY,
            drawMajorGridLines: false,
            drawMinorGridLines: false,
            drawMajorBands: false,
        });
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        class RectangleFillPaletteProvider extends DefaultPaletteProvider {
            public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.SOLID;

            private readonly colors: number[];

            constructor(colorStrings: string[]) {
                super();
                // Convert hex color strings to ARGB numbers
                this.colors = colorStrings.map((color) => parseColorToUIntArgb(color));
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

        const updateGaugeData = (dataSeries: XyyDataSeries, value: number, position: number) => {
            dataSeries.clear();
            const columnYValues = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(
                (y) => y <= value
            );
            const xValues = columnYValues.map((d) => position);
            const yValues = columnYValues.map((d, i) => (i === 0 ? columnYValues[0] : columnYValues[i - 1]));
            dataSeries.appendRange(xValues, yValues, columnYValues);
        };

        const createGauge = (value: number, width: number, position: number) => {
            const dataSeries = new XyyDataSeries(wasmContext);
            updateGaugeData(dataSeries, value, position);

            const backgroundRectangle = new FastRectangleRenderableSeries(wasmContext, {
                dataSeries: new XyyDataSeries(wasmContext, {
                    xValues: [-2 + position * width * 2],
                    yValues: [-10.5],
                    y1Values: [10.5],
                }),
                columnXMode: EColumnMode.Start,
                columnYMode: EColumnYMode.TopBottom,
                dataPointWidth: width + 4,
                dataPointWidthMode: EDataPointWidthMode.Range,
                fill: appTheme.DarkIndigo,
                strokeThickness: 2,
                stroke: "gray",
            });

            const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
                dataSeries,
                columnXMode: EColumnMode.Start,
                columnYMode: EColumnYMode.TopBottom,
                dataPointWidth: width,
                dataPointWidthMode: EDataPointWidthMode.Range,
                stroke: appTheme.DarkIndigo, // Thick stroke same color as background gives gaps between rectangles
                strokeThickness: 4,
                paletteProvider: new RectangleFillPaletteProvider(GRADIENT_COLOROS),
                fill: appTheme.ForegroundColor + "00",
            });

            sciChartSurface.renderableSeries.add(backgroundRectangle, rectangleSeries);
            return dataSeries;
        };

        const gaugeValues = [0, 3, 4, 7, -2, -8, 4];
        let i = 0;
        const dataSeries = createGauge(gaugeValues[i], 10, 0);

        setInterval(() => {
            i += 1;
            if (i === gaugeValues.length) {
                i = 0;
            }
            const value = gaugeValues[i];
            updateGaugeData(dataSeries, value, 0);
        }, 1000);

        return { sciChartSurface, wasmContext };
    };

    return {
        gauge1,
        gauge2,
        gauge3,
        gauge4,
        gauge5,
        gauge6,
    };
};
