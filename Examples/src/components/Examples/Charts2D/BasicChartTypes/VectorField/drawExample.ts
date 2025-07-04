import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    CentralAxesLayoutManager,
    FastLineSegmentRenderableSeries,
    IStrokePaletteProvider,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    IRenderableSeries,
    TPaletteProviderDefinition,
    EPaletteProviderType,
    XyDataSeries,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    FastTriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    CursorModifier,
    TCursorTooltipDataTemplate,
    SeriesInfo,
    XySeriesInfo,
} from "scichart";

import { appTheme } from "../../../theme";

const lineStartColor = appTheme.VividBlue; //"red";
const lineEndColor = appTheme.VividOrange; //"blue";

class LineSegmentPaletteProvider implements IStrokePaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.GRADIENT;
    private readonly palettedStart = parseColorToUIntArgb(lineStartColor);
    private readonly palettedEnd = parseColorToUIntArgb(lineEndColor);

    public onAttached(parentSeries: IRenderableSeries): void {}

    public onDetached(): void {}

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return index % 2 === 0 ? this.palettedStart : this.palettedEnd;
    }

    public toJSON(): TPaletteProviderDefinition {
        return { type: EPaletteProviderType.Custom, customType: "MyPaletteProvider" };
    }
}

// Tooltip Data Template
const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[]) => {
    const valuesWithLabels: string[] = [];
    seriesInfos.forEach((si) => {
        const xySI = si as XySeriesInfo;
        if (xySI.isWithinDataBounds) {
            if (!isNaN(xySI.yValue) && xySI.isHit) {
                valuesWithLabels.push(
                    `start (${xySI.xValue},${xySI.yValue}) end (${xySI.point2xValue},${xySI.point2yValue})`
                );
            }
        }
    });
    return valuesWithLabels;
};

function addArrowheads(xValues: number[], yValues: number[], arrowLength = 0.2, arrowAngle = Math.PI / 12) {
    function distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    const arrows = [];
    for (let i = 0; i < xValues.length; i += 2) {
        // Line start and end
        const x1 = xValues[i];
        const y1 = yValues[i];
        const x2 = xValues[i + 1];
        const y2 = yValues[i + 1];

        const lineLenght = distance(x1, y1, x2, y2);

        arrowLength = lineLenght / 5;

        // Direction of the line
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lineAngle = Math.atan2(dy, dx);

        // Arrowhead points
        const angle1 = lineAngle + Math.PI - arrowAngle;
        const angle2 = lineAngle + Math.PI + arrowAngle;

        const arrowPoint1 = [x2 + arrowLength * Math.cos(angle1), y2 + arrowLength * Math.sin(angle1)];
        const arrowPoint2 = [x2 + arrowLength * Math.cos(angle2), y2 + arrowLength * Math.sin(angle2)];

        // Arrowhead: [tip, base1, base2]
        arrows.push([
            [x2, y2], // Tip of the arrow
            arrowPoint1, // First base point
            arrowPoint2, // Second base point
        ]);
    }
    return arrows;
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // configure central axes
    const layoutManager = new CentralAxesLayoutManager();

    sciChartSurface.layoutManager = layoutManager;

    const xMin = -15;
    const xMax = 15;
    const yMin = -10;
    const yMax = 10;

    const growBy = new NumberRange(0.1, 0.1);

    const xAxis = new NumericAxis(wasmContext, {
        axisBorder: { color: "white", borderBottom: 1 },
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        growBy,
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisBorder: { color: "white", borderRight: 1 },
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        growBy,
    });
    sciChartSurface.yAxes.add(yAxis);

    const multiplier = 0.01;

    const linesXValues: number[] = [];
    const linesYValues: number[] = [];

    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            // start point
            // dataSeries.append(x, y);
            linesXValues.push(x);
            linesYValues.push(y);
            // end point
            const xEnd = x + (x * x - y * y - 4) * multiplier;
            const yEnd = y + 2 * x * y * multiplier;

            linesXValues.push(xEnd);
            linesYValues.push(yEnd);
        }
    }

    const lineSegmentSeries = new FastLineSegmentRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: linesXValues,
            yValues: linesYValues,
        }),
        strokeThickness: 4,
        paletteProvider: new LineSegmentPaletteProvider(),
    });

    const arrowheads = addArrowheads(linesXValues, linesYValues);

    console.log(arrowheads.flat());

    const arrowheadsXvalues = arrowheads.flat().map((d) => d[0]);
    const arrowheadsYvalues = arrowheads.flat().map((d) => d[1]);

    const polygonSeries = new FastTriangleRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: arrowheadsXvalues,
            yValues: arrowheadsYvalues,
        }),
        isDigitalLine: false,
        opacity: 1,
        fill: lineEndColor,
        drawMode: ETriangleSeriesDrawMode.List, // Polygon / List / Strip
    });

    sciChartSurface.renderableSeries.add(lineSegmentSeries);

    sciChartSurface.renderableSeries.add(polygonSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true, tooltipDataTemplate }));

    return { sciChartSurface, wasmContext };
};
