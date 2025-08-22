import { appTheme } from "../../../theme";
import {
    EllipsePointMarker,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    XyDataSeries,
    XyScatterRenderableSeries,
    FastLineRenderableSeries,
    INumericAxisOptions,
    ENumericFormat,
    EAutoRange,
    TSciChart,
    ESubSurfacePositionCoordinateMode,
    SciChartSubSurface,
    Rect,
    I2DSubSurfaceOptions,
    Thickness,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    FadeAnimation,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    EModifierMouseArgKey,
    EExecuteOn,
    EAxisAlignment,
    TextLabelProvider,
    ELabelAlignment,
} from "scichart";

import correlationLinePoints from "./correlationLinePoints";
import { getSubChartPositionIndexes } from "../../../FeaturedApps/FeatureDemos/SubChartsAPI/helpers";

const axisOptions: INumericAxisOptions = {
    useNativeText: true,
    isVisible: false,
    drawMajorBands: false,
    drawMinorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,
    drawMajorGridLines: false,
    labelStyle: { fontSize: 8 },
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    autoRange: EAutoRange.Always,
};

// theme overrides
const sciChartTheme = appTheme.SciChartJsTheme;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.createSingle(rootElement, {
        theme: sciChartTheme,
    });

    const subChartsNumber = 24;
    const columnsNumber = 6;
    const rowsNumber = 4;

    const pointsOnChart = 200;

    const subchartBorderColor = appTheme.VividSkyBlue;
    const scatterColor = appTheme.VividSkyBlue;
    const lineColor = appTheme.VividOrange;
    const lineUp = appTheme.VividGreen;
    const lineDown = appTheme.VividRed;
    const lineHorizontal = appTheme.ForegroundColor;
    const annotationColor = appTheme.ForegroundColor;

    const annotationFontSize = 14;

    const xAxisVisibleRange = new NumberRange(0, columnsNumber);
    const yAxisVisibleRange = new NumberRange(0, rowsNumber);

    // const originalGetStrokeColor = sciChartTheme.getStrokeColor;
    // let counter = 0;
    // sciChartTheme.getStrokeColor = (index: number, max: number, context: TSciChart) => {
    //     const currentIndex = counter % subChartsNumber;
    //     counter += 3;
    //     return originalGetStrokeColor.call(sciChartTheme, currentIndex, subChartsNumber, context);
    // };

    // const originalGetFillColor = sciChartTheme.getFillColor;
    // sciChartTheme.getFillColor = (index: number, max: number, context: TSciChart) => {
    //     const currentIndex = counter % subChartsNumber;
    //     counter += 3;
    //     return originalGetFillColor.call(sciChartTheme, currentIndex, subChartsNumber, context);
    // };

    const mainXAxis = new NumericAxis(wasmContext, {
        // autoRange: EAutoRange.Always,
        zoomExtentsRange: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        isVisible: true,
        id: "mainXAxis",
        visibleRange: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        visibleRangeLimit: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        axisAlignment: EAxisAlignment.Top,
        useNativeText: false,
        // autoTicks: false,
        // majorDelta: 1,
        labelProvider: new TextLabelProvider({
            labels: { 0.5: "A", 1.5: "B", 2.5: "C", 3.5: "D", 4.5: "E", 5.5: "F" },
            useNativeText: false,
        }),
        labelStyle: {
            alignment: ELabelAlignment.Center,
            fontFamily: "Arial",
            fontSize: 24,
            fontWeight: "bold",
            color: "White",
        },
        // growBy: new NumberRange(0.5, 0.5),
    });

    mainXAxis.tickProvider.getMajorTicks = (minorDelta: number, majorDelta: number, visibleRange: NumberRange) =>
        [...new Array(columnsNumber)].map((d, i) => i + 0.5);

    // console.log([...new Array(columnsNumber)].map((d, i) => i + 0.5))

    mainSurface.xAxes.add(mainXAxis);

    const mainYAxis = new NumericAxis(wasmContext, {
        // autoRange: EAutoRange.Always,
        zoomExtentsRange: new NumberRange(yAxisVisibleRange.min, yAxisVisibleRange.max),
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        isVisible: true,
        id: "mainYAxis",
        visibleRange: new NumberRange(yAxisVisibleRange.min, yAxisVisibleRange.max),
        visibleRangeLimit: new NumberRange(yAxisVisibleRange.min, yAxisVisibleRange.max),
        axisAlignment: EAxisAlignment.Left,

        flippedCoordinates: true,

        useNativeText: false,
        labelProvider: new TextLabelProvider({
            labels: { 0.5: "1", 1.5: "2", 2.5: "3", 3.5: "4" },
            useNativeText: false,
        }),
        labelStyle: {
            alignment: ELabelAlignment.Center,
            fontFamily: "Arial",
            fontSize: 24,
            fontWeight: "bold",
            color: "White",
        },
        // growBy: new NumberRange(2, 2),
    });
    mainSurface.yAxes.add(mainYAxis);

    mainSurface.chartModifiers.add(
        new ZoomExtentsModifier({ executeCondition: { key: EModifierMouseArgKey.Ctrl } }),
        new ZoomPanModifier({
            executeCondition: { button: EExecuteOn.MouseLeftButton, key: EModifierMouseArgKey.Ctrl },
        }),
        new MouseWheelZoomModifier({ executeCondition: { key: EModifierMouseArgKey.Ctrl } })
    );

    // let myCanvas = document.getElementsByClassName("canvas-root");

    // myCanvas[0].addEventListener("dblclick", function (e) {
    //     console.log(e);
    // });

    const subChartPositioningCoordinateMode = ESubSurfacePositionCoordinateMode.DataValue; //.Relative;

    const initSubChart = (subChartIndex: number) => {
        // calculate sub-chart position and sizes
        const { rowIndex, columnIndex } = getSubChartPositionIndexes(subChartIndex, columnsNumber);

        const width = 1; //columnsNumber / columnsNumber;
        const height = 1; // rowsNumber / rowsNumber;

        const position = new Rect(columnIndex * width, rowIndex * height, width, height);

        // sub-surface configuration
        const subChartOptions: I2DSubSurfaceOptions = {
            id: `subChart-${subChartIndex}`,
            theme: sciChartTheme,
            position,
            parentXAxisId: mainXAxis.id,
            parentYAxisId: mainYAxis.id,
            coordinateMode: subChartPositioningCoordinateMode,
            padding: Thickness.fromNumber(0),
            viewportBorder: {
                color: subchartBorderColor + "30",
                border: 1,
            },
        };

        // create sub-surface
        const subChartSurface = SciChartSubSurface.createSubSurface(mainSurface, subChartOptions);

        // add axes to the sub-surface
        const subChartXAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-XAxis`,
            growBy: new NumberRange(0.04, 0.04),
            useNativeText: true,
        });

        subChartSurface.xAxes.add(subChartXAxis);

        const subChartYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-YAxis`,
            growBy: new NumberRange(0.05, 0.15),
            useNativeText: true,
            // autoRange: EAutoRange.Always,
        });
        subChartSurface.yAxes.add(subChartYAxis);

        function generateScatterplotData(numElements: number, index: number) {
            let x: number[] = [];
            let y: number[] = [];

            let randomNum = Math.random();

            if (randomNum <= 0.33) {
                x = Array.from({ length: numElements }, (x, i) => i);
                y = x.map((x) => 0.01 * x + x * Math.random());
            } else if (randomNum <= 0.66) {
                x = Array.from({ length: numElements }, (x, i) => i);
                y = x.map((x) => numElements / (x * Math.random() + 5));
            } else {
                for (let i = 0; i < numElements; i++) {
                    x.push(Math.random());
                    y.push(Math.random());
                }
            }

            return { x, y };
        }

        const { x: xValues, y: yValues } = generateScatterplotData(pointsOnChart, subChartIndex);

        const { correlationCoefficient, linePoints } = correlationLinePoints(xValues, yValues);

        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [linePoints.x1, linePoints.x2],
                yValues: [linePoints.y1, linePoints.y2],
            }),
            stroke: correlationCoefficient > 0.1 ? lineUp : correlationCoefficient < -0.1 ? lineDown : lineHorizontal,
            strokeThickness: 3,
            opacity: 0.6,
            animation: new FadeAnimation({ duration: 600, fadeEffect: true }),
        });

        const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 2,
                height: 2,
                strokeThickness: 0,
                fill: scatterColor,
            }),
            opacity: 1,
        });

        const annotation = new TextAnnotation({
            x1: 5,
            y1: 0.07,
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: annotationColor,
            fontSize: annotationFontSize,
            fontFamily: "Default",
            text: `i = ${subChartIndex}, r = ${correlationCoefficient.toFixed(2)}`,
        });

        subChartSurface.renderableSeries.add(scatterSeries, lineSeries);
        subChartSurface.annotations.add(annotation);

        subChartSurface.chartModifiers.add(
            new ZoomExtentsModifier(),
            new ZoomPanModifier(),
            new MouseWheelZoomModifier()
        );
    };

    // generate the subcharts grid
    for (let subChartIndex = 0; subChartIndex < subChartsNumber; subChartIndex += 1) {
        initSubChart(subChartIndex);
    }

    return {
        wasmContext,
        sciChartSurface: mainSurface,
    };
};
