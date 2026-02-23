import {
    AUTO_COLOR,
    AxisBase2D,
    BaseDataSeries,
    EAutoRange,
    EDataSeriesType,
    ENumericFormat,
    ESeriesType,
    ESubSurfacePositionCoordinateMode,
    FastLineRenderableSeries,
    I2DSubSurfaceOptions,
    IBaseDataSeriesOptions,
    INumericAxisOptions,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
    Thickness,
    TSciChart,
    XyDataSeries
} from "scichart";
import { GetRandomData, getSubChartPositionIndexes, prePopulateData } from "../helpers";
import { ChartInitializer } from "../ChartInitializer";

export class SubChartsInitializer extends ChartInitializer {
    protected override async configureSeries(sciChartSurface: SciChartSurface) {
        // This Initializer adds series only to subcharts
        if (SciChartSurface.isSubSurface(sciChartSurface)) {
            return super.configureSeries(sciChartSurface);
        }
    }

    protected override async configureSubCharts(params: {
        mainSurface: SciChartSurface;
        mainXAxis: AxisBase2D;
        mainYAxis: AxisBase2D;
    }) {
        const { mainSurface, mainXAxis, mainYAxis } = params;
        const wasmContext = mainSurface.webAssemblyContext2D;

        const subChartsNumber = this.options.subChartsNumber;
        const drawLabels = this.options.drawLabels;

        const columnsNumber = Math.ceil(Math.sqrt(subChartsNumber));
        const rowsNumber = Math.ceil(subChartsNumber / columnsNumber);
        const subChartPositioningCoordinateMode = ESubSurfacePositionCoordinateMode.Relative;

        const initSubChart = (seriesType: ESeriesType, subChartIndex: number) => {
            // calculate sub-chart position and sizes
            const { rowIndex, columnIndex } = getSubChartPositionIndexes(
                subChartIndex,
                columnsNumber
            );
            const width = 1 / columnsNumber;
            const height = 1 / rowsNumber;

            const position = new Rect(columnIndex * width, rowIndex * height, width, height);

            // sub-surface configuration
            const subChartOptions: I2DSubSurfaceOptions = {
                id: `subChart-${subChartIndex}`,
                position,
                parentXAxisId: mainXAxis.id,
                parentYAxisId: mainYAxis.id,
                coordinateMode: subChartPositioningCoordinateMode,
                padding: Thickness.fromNumber(1),
                // viewportBorder: {
                //     color: "rgba(150, 74, 148, 0.51)",
                //     border: 2
                // },
                // title: seriesNamesMap[seriesType],
                titleStyle: {
                    placeWithinChart: true,
                    fontSize: 12,
                    padding: Thickness.fromString("10 4 0 4"),
                    color: "white"
                }
            };

            // create sub-surface
            const subChartSurface = SciChartSubSurface.createSubSurface(
                mainSurface,
                subChartOptions
            );

            const axisOptions: INumericAxisOptions = {
                useNativeText: true,
                isVisible: drawLabels,
                drawMajorBands: false,
                drawMinorGridLines: false,
                drawMinorTickLines: false,
                drawMajorTickLines: false,
                drawMajorGridLines: false,
                // labelStyle: { fontSize: 8 },
                labelFormat: ENumericFormat.Decimal,
                labelPrecision: 0,
                autoRange: EAutoRange.Always
            };

            // add axes to the sub-surface
            const subChartXAxis = new NumericAxis(wasmContext, {
                ...axisOptions,
                id: `${subChartSurface.id}-XAxis`,
                growBy: new NumberRange(0.0, 0.0),
                useNativeText: true
            });

            subChartSurface.xAxes.add(subChartXAxis);

            const subChartYAxis = new NumericAxis(wasmContext, {
                ...axisOptions,
                id: `${subChartSurface.id}-YAxis`,
                growBy: new NumberRange(0.01, 0.1),
                useNativeText: true
            });
            subChartSurface.yAxes.add(subChartYAxis);

            this.configureSeries(subChartSurface);
        };

        // generate the subcharts grid
        for (let subChartIndex = 0; subChartIndex < subChartsNumber; ++subChartIndex) {
            initSubChart(ESeriesType.LineSeries, subChartIndex);
        }
    }
}
