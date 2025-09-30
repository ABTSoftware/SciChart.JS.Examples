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
    XyzDataSeries,
    FastRectangleRenderableSeries,
    EColumnMode,
    EColumnYMode,
    IFillPaletteProvider,
    IPointMetadata,
    parseColorToUIntArgb,
    EFillPaletteMode,
} from "scichart";
import { WaferLotData } from "./waferData";

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

// Function to find min and max values in an array
function findMinMax(arr: number[]) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return { min: undefined, max: undefined };
    }

    return {
        min: Math.min(...arr),
        max: Math.max(...arr),
    };
}

function correlationLinePoints(x: number[], y: number[]) {
    if (x.length !== y.length || x.length === 0) {
        throw new Error("Arrays must have the same non-zero length.");
    }
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;
    let covXY = 0;
    let varX = 0;

    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        numerator += dx * dy;
        denominatorX += dx * dx;
        denominatorY += dy * dy;
        covXY += dx * dy;
        varX += dx * dx;
    }

    const r = denominatorX * denominatorY === 0 ? 0 : numerator / Math.sqrt(denominatorX * denominatorY);

    // Regression line slope and intercept
    const slope = covXY / varX;
    const intercept = meanY - slope * meanX;

    // Find x range
    const xStart = Math.min(...x);
    const xEnd = Math.max(...x);

    // Calculate corresponding y for line ends
    const yStart = slope * xStart + intercept;
    const yEnd = slope * xEnd + intercept;

    return {
        correlationCoefficient: +r.toFixed(2),
        linePoints: { x1: xStart, y1: yStart, x2: xEnd, y2: yEnd },
    };
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

export const drawPlot = async (rootElement: string | HTMLDivElement, selectedPoint: WaferLotData) => {
    // Use createSingle here to get the performance benefit of subcharts
    const { wasmContext, sciChartSurface: mainSurface } = await SciChartSurface.createSingle(rootElement, {
        theme: sciChartTheme,
        // title: "Hold Ctrl to Zoom / Pan the whole grid rather than an individual chart",
        // titleStyle: { fontSize: 14, position: ETitlePosition.Bottom },
    });

    const subChartsNumber = 20;
    const columnsNumber = 5;
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
    const vGroup = new SciChartVerticalGroup();
    let maxYRange = new NumberRange(-1, 1);

    const initSubChart = (subChartIndex: number, selectedPoint: WaferLotData) => {
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
            isVisible: false, //rowIndex === rowsNumber - 1,
        });

        subChartSurface.xAxes.add(subChartXAxis);

        const subChartYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: `${subChartSurface.id}-YAxis`,
            axisAlignment: EAxisAlignment.Left,
            isVisible: false, //columnIndex === 0,
            growBy: new NumberRange(0.04, 0.04),
        });

        subChartSurface.yAxes.add(subChartYAxis);

        let dataJSON: RectangleMeta[] = [];

        function findMinMax(arr: number[]) {
            if (!Array.isArray(arr) || arr.length === 0) {
                return { min: undefined, max: undefined };
            }

            return {
                min: Math.min(...arr),
                max: Math.max(...arr),
            };
        }

        const generateGridOfPoints = (selectedPoint: WaferLotData) => {
            // const containerWidth = subChartSurface.domChartRoot.clientWidth;
            // console.log(`Container width: ${containerWidth}px`);

            const waferSize = 21; // containerWidth <= 500 ? 50 : 100; // Size of the wafer grid

            dataJSON = [];

            for (let row = 0; row < waferSize; row++) {
                for (let col = 0; col < waferSize; col++) {
                    // Calculate distance from center to create a circular pattern
                    const centerX = waferSize / 2;
                    const centerY = waferSize / 2;
                    const distance = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));

                    // Only include points within the circular wafer area
                    if (distance <= waferSize / 2) {
                        // Determine defect type based on distance from center and selected point values
                        let defectType: DefectKey = "OK";

                        // const randomValue = Math.random() * Math.pow(Math.cbrt(selectedPoint.Input2), 2.2);

                        // Use the selected point's values to influence the defect distribution
                        // const randomValue = Math.pow(Math.cbrt(selectedPoint.Input2), 2.2); //* (Math.sqrt(selectedPoint.Measure3 * 10));

                        const randomValue = Math.random() * Math.pow(Math.cbrt(selectedPoint.Input2), 2.2);

                        if (distance > waferSize / 2.5) {
                            // Edge defects are more common
                            if (randomValue < 0.6) defectType = "S48";
                            else if (randomValue < 0.8) defectType = "S36";
                        } else if (distance < waferSize / 5) {
                            // Center defects
                            if (randomValue < 0.3) defectType = "S28";
                        }

                        // Create a data point with values influenced by the selected point
                        dataJSON.push({
                            MAP_ROW: row,
                            MAP_COL: col,
                            FF_ROW: Math.floor(Math.random() * 10),
                            FF_COL: Math.floor(Math.random() * 10),
                            WIF_COL: Math.floor(Math.random() * 50),
                            WIF_ROW: Math.floor(Math.random() * 50),
                            DEFECT: defectType,
                            MR: (Math.random() - 0.5) * 20,
                            HR: (Math.random() - 0.5) * 10,
                            HDI: (Math.random() - 0.5) * 5,
                            MR2: (Math.random() - 0.5) * 30,
                        });
                    }
                }
            }
        };

        let dataSeries = new XyzDataSeries(wasmContext, {});

        const setData = (selectedPoint: WaferLotData) => {
            generateGridOfPoints(selectedPoint);

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
            const { min, max } = findMinMax(zValues);

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

        subChartSurface.chartModifiers.add(
            new ZoomExtentsModifier(),
            new ZoomPanModifier(),
            new MouseWheelZoomModifier()
        );
    };

    // generate the subcharts grid
    for (let subChartIndex = 0; subChartIndex < subChartsNumber; subChartIndex += 1) {
        initSubChart(subChartIndex, selectedPoint);
    }

    const generateSubcharts = (selectedPoint: WaferLotData) => {
        const subCharts = [...mainSurface.subCharts];

        subCharts.forEach((subChart) => {
            // If using axis synchronization, remove axes from synchronizer first (if applicable)
            // axisSynchronizer.removeAxis(subChart.xAxes[0]); // Uncomment if needed

            // Remove the sub-chart
            mainSurface.removeSubChart(subChart);
        });

        for (let subChartIndex = 0; subChartIndex < subChartsNumber; subChartIndex += 1) {
            initSubChart(subChartIndex, selectedPoint);
        }
    };

    return {
        wasmContext,
        sciChartSurface: mainSurface,
        generateSubcharts,
    };
};
