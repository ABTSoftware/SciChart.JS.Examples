import { appTheme } from "../../../theme";
import {
    NumericAxis,
    NumberRange,
    SciChartSurface,
    INumericAxisOptions,
    ENumericFormat,
    ESubSurfacePositionCoordinateMode,
    SciChartSubSurface,
    Rect,
    I2DSubSurfaceOptions,
    Thickness,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    EModifierMouseArgKey,
    EExecuteOn,
    EAxisAlignment,
    TextLabelProvider,
    ELabelAlignment,
    XyzDataSeries,
    FastRectangleRenderableSeries,
    EColumnMode,
    EColumnYMode,
    IFillPaletteProvider,
    IPointMetadata,
    parseColorToUIntArgb,
    EFillPaletteMode,
    ModifierMouseArgs,
} from "scichart";
import { generateGridOfPoints, IBatchMetadata, WaferLotData } from "./waferData";

// import correlationLinePoints from "./correlationLinePoints";
// import { getSubChartPositionIndexes } from "../../FeatureDemos/SubChartsAPI/helpers";

const defectsObjectColors: Record<DefectKey, string> = {
    OK: appTheme.PaleTeal,
    S02: appTheme.VividBlue,
    S04: appTheme.VividBlue,
    S12: appTheme.VividBlue,
    S14: appTheme.VividBlue,
    S16: appTheme.VividBlue,
    S23: appTheme.VividBlue,
    S26: appTheme.VividBlue,
    S27: appTheme.VividBlue,
    S28: appTheme.VividBlue,
    S36: appTheme.VividOrange,
    S42: appTheme.VividBlue,
    S48: appTheme.VividRed,
    S49: appTheme.VividBlue,
};

interface RectangleMeta {
    MAP_ROW: number;
    MAP_COL: number;
    FF_ROW: number;
    FF_COL: number;
    WIF_COL: number;
    WIF_ROW: number;
    DEFECT: string;
    MR: number;
    HR: number;
    HDI: number;
    MR2: number;
}

type DefectKey =
    | "OK"
    | "S02"
    | "S04"
    | "S12"
    | "S14"
    | "S16"
    | "S23"
    | "S26"
    | "S27"
    | "S28"
    | "S36"
    | "S42"
    | "S48"
    | "S49";

class RectanglePaletteProvider implements IFillPaletteProvider {
    private readonly metadata: RectangleMeta[];

    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    public onAttached(): void {}
    public onDetached(): void {}

    constructor(metadata: RectangleMeta[]) {
        this.metadata = metadata;
    }

    // Called for each rectangle for fill color
    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        // Use metadata array to select color
        const meta = this.metadata[index];
        if (meta && (meta as any).DEFECT) {
            return parseColorToUIntArgb(defectsObjectColors[meta.DEFECT as DefectKey]);
        }
        return undefined;
    }
}

function getSubChartPositionIndexes(chartIndex: number, columnNumber: number) {
    const rowIndex = Math.floor(chartIndex / columnNumber);
    const columnIndex = chartIndex % columnNumber;
    return { rowIndex, columnIndex };
}

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

export const drawPlot = async (rootElement: string | HTMLDivElement, selectedPoint: IBatchMetadata) => {
    // Use createSingle here to get the performance benefit of subcharts
    const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.createSingle(rootElement, {
        theme: sciChartTheme,
    });

    const subChartsNumber = 12;
    const columnsNumber = 4;
    const rowsNumber = 3;

    const subchartBorderColor = appTheme.VividSkyBlue;

    const xAxisVisibleRange = new NumberRange(0, columnsNumber);
    const yAxisVisibleRange = new NumberRange(0, rowsNumber);

    const mainXAxis = new NumericAxis(wasmContext, {
        // zoomExtentsRange: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        isVisible: true,
        id: "mainXAxis",
        visibleRange: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        visibleRangeLimit: new NumberRange(xAxisVisibleRange.min, xAxisVisibleRange.max),
        axisAlignment: EAxisAlignment.Top,
        useNativeText: false,
        labelProvider: new TextLabelProvider({
            labels: { 0.5: "A", 1.5: "B", 2.5: "C", 3.5: "D", 4.5: "E", 5.5: "F" },
            useNativeText: false,
        }),
        labelStyle: {
            alignment: ELabelAlignment.Center,
            fontFamily: "Arial",
            fontSize: 14,
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
            fontSize: 14,
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

    const initSubChart = (subChartIndex: number, selectedPoint: IBatchMetadata) => {
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
            isVisible: false,
        });

        subChartSurface.xAxes.add(subChartXAxis);

        const subChartYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-YAxis`,
            axisAlignment: EAxisAlignment.Left,
            isVisible: false,
            growBy: new NumberRange(0.04, 0.04),
        });

        subChartSurface.yAxes.add(subChartYAxis);

        let dataSeries = new XyzDataSeries(wasmContext, {});

        const setData = (selectedPoint: IBatchMetadata) => {
            let dataJSON = generateGridOfPoints(selectedPoint, subChartIndex);

            subChartSurface.renderableSeries.clear(true);

            // Extract data for the chart
            const data = dataJSON.reduce(
                (acc, curr) => {
                    acc.xValues.push(+curr["MAP_COL"]);
                    acc.yValues.push(+curr["MAP_ROW"]);
                    acc.zValues.push(+curr["MR"]);
                    return acc;
                },
                { xValues: [], yValues: [], zValues: [] } as { xValues: number[]; yValues: number[]; zValues: number[] }
            );

            const { xValues, yValues, zValues } = data;

            // Create data series
            dataSeries = new XyzDataSeries(wasmContext, {
                xValues,
                yValues,
                zValues,
                metadata: dataJSON.map((d) => ({ ...d, isSelected: false })),
            });

            // Create and add rectangle series
            const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
                dataSeries,
                columnXMode: EColumnMode.Start,
                columnYMode: EColumnYMode.TopHeight,
                paletteProvider: new RectanglePaletteProvider(dataJSON),
                dataPointWidth: 1,
                defaultY1: 1,
                strokeThickness: 0,
            });

            subChartSurface.renderableSeries.add(rectangleSeries);
        };

        setData(selectedPoint);

        subChartSurface.zoomExtents();
    };

    // generate the subcharts grid
    for (let subChartIndex = 0; subChartIndex < subChartsNumber; subChartIndex += 1) {
        initSubChart(subChartIndex, selectedPoint);
    }

    const generateSubcharts = (selectedPoint: IBatchMetadata) => {
        const subCharts = [...mainSurface.subCharts];

        subCharts.forEach((subChart) => {
            // Remove the sub-chart
            mainSurface.removeSubChart(subChart);
        });

        for (let subChartIndex = 0; subChartIndex < subChartsNumber; subChartIndex += 1) {
            initSubChart(subChartIndex, selectedPoint);
        }
    };

    mainSurface.zoomExtents();

    return {
        sciChartSurface: mainSurface,
        generateSubcharts,
    };
};
