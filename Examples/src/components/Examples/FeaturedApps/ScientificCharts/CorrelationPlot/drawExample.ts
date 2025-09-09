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
    ETitlePosition,
    SciChartVerticalGroup,
} from "scichart";

import correlationLinePoints from "./correlationLinePoints";
import { getSubChartPositionIndexes } from "../../FeatureDemos/SubChartsAPI/helpers";

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
    labelPrecision: 1,
};

// theme overrides
const sciChartTheme = appTheme.SciChartJsTheme;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Use createSingle here to get the performance benefit of subcharts
    const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.createSingle(rootElement, {
        theme: sciChartTheme,
        title: "Hold Ctrl to Zoom / Pan the whole grid rather than an individual chart",
        titleStyle: { fontSize: 14, position: ETitlePosition.Bottom },
    });

    const subChartsNumber = 24;
    const columnsNumber = 6;
    const rowsNumber = 4;

    const pointsOnChart = 5000;

    const subchartBorderColor = appTheme.VividSkyBlue;
    const scatterColor = appTheme.VividSkyBlue;
    const lineUp = appTheme.VividGreen;
    const lineDown = appTheme.VividRed;
    const lineHorizontal = appTheme.ForegroundColor;
    const annotationColor = appTheme.ForegroundColor;

    const annotationFontSize = 14;

    const xAxisVisibleRange = new NumberRange(0, columnsNumber);
    const yAxisVisibleRange = new NumberRange(0, rowsNumber);

    const mainXAxis = new NumericAxis(wasmContext, {
        zoomExtentsRange: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        isVisible: true,
        id: "mainXAxis",
        visibleRange: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        // Uncomment this to limit panning when fully zoomed out
        //visibleRangeLimit: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        axisAlignment: EAxisAlignment.Top,
        useNativeText: false,
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
    });

    // provide hardcoded tick values for the x axis as these will be used to position column names
    mainXAxis.tickProvider.getMajorTicks = (minorDelta: number, majorDelta: number, visibleRange: NumberRange) =>
        [...new Array(columnsNumber)].map((d, i) => i + 0.5);

    mainSurface.xAxes.add(mainXAxis);

    const mainYAxis = new NumericAxis(wasmContext, {
        zoomExtentsRange: new NumberRange(yAxisVisibleRange.min, yAxisVisibleRange.max),
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        isVisible: true,
        id: "mainYAxis",
        visibleRange: new NumberRange(yAxisVisibleRange.min, yAxisVisibleRange.max),
        // Uncomment this to limit panning when fully zoomed out
        //visibleRangeLimit: new NumberRange(yAxisVisibleRange.min, yAxisVisibleRange.max),
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
    });
    mainSurface.yAxes.add(mainYAxis);

    // The executeCondition set here allows these modifiers to activate independently of the ones on the individual subSurfaces
    mainSurface.chartModifiers.add(
        new ZoomExtentsModifier({ executeCondition: { key: EModifierMouseArgKey.Ctrl } }),
        new ZoomPanModifier({
            executeCondition: { button: EExecuteOn.MouseLeftButton, key: EModifierMouseArgKey.Ctrl },
        }),
        new MouseWheelZoomModifier({ executeCondition: { key: EModifierMouseArgKey.Ctrl } })
    );

    const subChartPositioningCoordinateMode = ESubSurfacePositionCoordinateMode.DataValue;
    const vGroup = new SciChartVerticalGroup();
    let maxYRange = new NumberRange(-1, 1);

    const initSubChart = (subChartIndex: number) => {
        const { rowIndex, columnIndex } = getSubChartPositionIndexes(subChartIndex, columnsNumber);

        const width = 1;
        const height = 1;

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
            isVisible: rowIndex === rowsNumber - 1,
        });

        subChartSurface.xAxes.add(subChartXAxis);

        const subChartYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-YAxis`,
            axisAlignment: EAxisAlignment.Left,
            isVisible: columnIndex === 0,
        });

        subChartSurface.yAxes.add(subChartYAxis);

        if (columnIndex === 0) {
            // Synchonise axis sizes
            vGroup.addSurfaceToGroup(subChartSurface);
            // Set y ranges for previous Row
            if (rowIndex > 0) {
                const start = (rowIndex - 1) * columnsNumber;
                for (let index = start; index < start + columnsNumber; index++) {
                    mainSurface.subCharts[index].yAxes.get(0).visibleRange = maxYRange;
                }
            }
            // reset range tracking
            maxYRange = new NumberRange(-1, 1);
        }

        const gaussianRand = (mean: number = 0.5, dist: number = 1) => {
            let rand = 0;
            for (let i = 0; i < 6; i += 1) {
                rand += Math.random() * dist + mean;
            }
            return rand / 6;
        };

        // generating random data for scatterplots
        function generateScatterplotData(numElements: number) {
            let x: number[] = [];
            let y: number[] = [];

            let randomNum = (Math.random() - 0.5) * 3;
            let randomNum1 = Math.random();

            for (let i = 0; i < numElements; i++) {
                const xVal = gaussianRand(0.5, 1);
                x.push(xVal);
                y.push(gaussianRand(xVal * randomNum, 1 + randomNum1 * 3));
            }
            return { x, y };
        }

        const { x: xValues, y: yValues } = generateScatterplotData(pointsOnChart);

        const { correlationCoefficient, linePoints } = correlationLinePoints(xValues, yValues);

        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [linePoints.x1, linePoints.x2],
                yValues: [linePoints.y1, linePoints.y2],
            }),
            stroke: correlationCoefficient > 0.1 ? lineUp : correlationCoefficient < -0.1 ? lineDown : lineHorizontal,
            strokeThickness: 3,
            opacity: 0.8,
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

        const xRange = scatterSeries.getXRange();
        const yRange = scatterSeries.getYRange(xRange);
        if (yRange.min < maxYRange.min || yRange.max > maxYRange.max) {
            maxYRange = maxYRange.union(yRange);
        }

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
    // set last row y range
    const start = (rowsNumber - 1) * columnsNumber;
    for (let index = start; index < start + columnsNumber; index++) {
        mainSurface.subCharts[index].yAxes.get(0).visibleRange = maxYRange;
    }

    return {
        wasmContext,
        sciChartSurface: mainSurface,
    };
};
