import {
    EAxisAlignment,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    XyDataSeries,
    TriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    CursorModifier,
    IFillPaletteProvider,
    EFillPaletteMode,
    parseColorToUIntArgb,
    IRenderableSeries,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.debugRendering = false;
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 800),
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Bottom,
        labelPrecision: 2,
        useNativeText: true,
        drawMajorBands: false,
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 500),
        axisAlignment: EAxisAlignment.Left,
        labelPrecision: 2,
        flippedCoordinates: false,
        useNativeText: true,
        drawMajorBands: false,
    });
    sciChartSurface.yAxes.add(yAxis);

    const sXValues = [
        329, 300, 264, 234, 195, 174, 134, 136, 87, 106, 61, 103, 74, 115, 92, 129, 116, 164, 156, 193, 208, 247, 242,
        286, 273, 321, 286, 327, 283, 321, 282, 308, 262, 280, 239, 213, 175, 144, 111, 82, 64,
    ];
    const sYValues = [
        426, 411, 446, 415, 446, 417, 446, 414, 426, 396, 385, 370, 338, 341, 309, 313, 275, 295, 255, 284, 232, 264,
        225, 248, 209, 212, 190, 174, 159, 136, 134, 102, 104, 75, 99, 68, 103, 76, 111, 83, 127,
    ];
    const sDataSeries = new XyDataSeries(wasmContext, { xValues: sXValues, yValues: sYValues });
    const sSeries = new TriangleRenderableSeries(wasmContext, {
        isDigitalLine: false,
        fill: "green",
        drawMode: ETriangleSeriesDrawMode.Strip,
        dataSeries: sDataSeries,
        paletteProvider: new SPaletteProvider(),
    });
    sciChartSurface.renderableSeries.add(sSeries);

    const triangleCenters = [
        [566, 279],
        [529, 292],
        [483, 292],
        [445, 274],
        [409, 250],
        [399, 208],
        [401, 167],
        [412, 129],
        [437, 91],
        [473, 77],
        [527, 77],
        [574, 90],
    ];
    const { xCoordinates, yCoordinates } = generateScaledAndRotatedEquilateralTriangles(triangleCenters);

    const cXValues = xCoordinates.reduce((a, b) => a.concat(b), []);
    const cYValues = yCoordinates.reduce((a, b) => a.concat(b), []);
    const cDataSeries = new XyDataSeries(wasmContext, { xValues: cXValues, yValues: cYValues });
    const cSeries = new TriangleRenderableSeries(wasmContext, {
        fill: "green",
        drawMode: ETriangleSeriesDrawMode.List,
        dataSeries: cDataSeries,
    });
    sciChartSurface.renderableSeries.add(cSeries);

    const pentagonsX = [
        [696.0, 679.82, 686.0, 706.0, 712.18],
        [696.0, 679.82, 686.0, 706.0, 712.18],
        [696.0, 679.82, 686.0, 706.0, 712.18],
        [696.0, 679.82, 686.0, 706.0, 712.18],
        [696.0, 679.82, 686.0, 706.0, 712.18],
        [696.0, 679.82, 686.0, 706.0, 712.18],
        [696.0, 679.82, 686.0, 706.0, 712.18],
    ];

    const pentagonsY = [
        [388.01, 376.26, 357.24, 357.24, 376.26],
        [307.01, 295.26, 276.24, 276.24, 295.26],
        [271.01, 259.26, 240.24, 240.24, 259.26],
        [231.01, 219.26, 200.24, 200.24, 219.26],
        [188.01, 176.26, 157.24, 157.24, 176.26],
        [144.01, 132.26, 113.24, 113.24, 132.26],
        [106.01, 94.26, 75.24, 75.24, 94.26],
    ];

    const iXValues = pentagonsX.reduce((a, b) => a.concat(b), []);
    const iYValues = pentagonsY.reduce((a, b) => a.concat(b), []);
    const iDataSeries = new XyDataSeries(wasmContext, { xValues: iXValues, yValues: iYValues });
    const iSeries = new TriangleRenderableSeries(wasmContext, {
        fill: "red",
        drawMode: ETriangleSeriesDrawMode.Polygon,
        polygonVertices: 5,
        dataSeries: iDataSeries,
    });
    sciChartSurface.renderableSeries.add(iSeries);

    sciChartSurface.chartModifiers.add(new CursorModifier({ showTooltip: true }));
    return { sciChartSurface, wasmContext };
};

class SPaletteProvider implements IFillPaletteProvider {
    // Why does the solid mode draw a gradient?
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly palettedRed = parseColorToUIntArgb("red");
    private readonly palettedGreen = parseColorToUIntArgb("green");

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        if (index % 3 === 0) {
            return this.palettedRed;
        } else {
            return this.palettedGreen;
        }
    }
}

function generateScaledAndRotatedEquilateralTriangles(centers: number[][]) {
    const xCoordinates = [];
    const yCoordinates = [];
    const numTriangles = centers.length;

    for (let i = 0; i < numTriangles; i++) {
        const [centerX, centerY] = centers[i];
        const side = 20 + (i / (numTriangles - 1)) * 20;
        const angle = (i / (numTriangles - 1)) * 60 * (Math.PI / 180);
        const height = (Math.sqrt(3) / 2) * side;
        const vertices = [
            [0, -height / 2],
            [-side / 2, height / 2],
            [side / 2, height / 2],
        ];

        const rotatedVertices = vertices.map(([x, y]) => {
            const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
            const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
            return [rotatedX + centerX, rotatedY + centerY];
        });

        const xCoords = rotatedVertices.map((vertex) => vertex[0]);
        const yCoords = rotatedVertices.map((vertex) => vertex[1]);

        xCoordinates.push(xCoords);
        yCoordinates.push(yCoords);
    }

    return { xCoordinates, yCoordinates };
}
