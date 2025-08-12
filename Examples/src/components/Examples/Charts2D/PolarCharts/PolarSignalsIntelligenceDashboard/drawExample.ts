import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode,
    NumberRange,
    EAxisAlignment,
    EPolarLabelMode,
    HeatmapColorMap,
    UniformHeatmapDataSeries,
    PolarUniformHeatmapRenderableSeries,
    HeatmapLegend,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";

const COLOR_MAP = new HeatmapColorMap({
    minimum: 0,
    maximum: 1,
    gradientStops: [
        { offset: 0, color: appTheme.VividPink },
        { offset: 0.2, color: appTheme.VividOrange },
        { offset: 0.4, color: appTheme.MutedRed },
        { offset: 0.6, color: appTheme.VividSkyBlue },
        { offset: 0.8, color: appTheme.Indigo },
        { offset: 1, color: appTheme.DarkIndigo },
    ],
});

/******************************************************************************
 * 1) Simple seeded RNG (LCG) + Perlin Noise implementation
 ******************************************************************************/
class LCG {
    private state: number;
    constructor(seed: number) {
        this.state = seed & 0xffffffff;
    }
    next() {
        this.state = (1664525 * this.state + 1013904223) & 0xffffffff;
        return this.state / 0x100000000;
    }
}

class Perlin2D {
    private perm: Uint8Array;
    constructor(seed: number) {
        const rng = new LCG(seed);
        // build and shuffle perm[0..255]
        this.perm = new Uint8Array(512);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(rng.next() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        // duplicate
        for (let i = 0; i < 512; i++) {
            this.perm[i] = p[i & 255];
        }
    }
    private fade(t: number) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    private lerp(a: number, b: number, t: number) {
        return a + t * (b - a);
    }
    private grad(hash: number, x: number, y: number) {
        // 8 possible gradients
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return (h & 1 ? -u : u) + (h & 2 ? -2 * v : 2 * v);
    }
    public noise(x: number, y: number) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = this.fade(xf);
        const v = this.fade(yf);

        const aa = this.perm[X + this.perm[Y]];
        const ab = this.perm[X + this.perm[Y + 1]];
        const ba = this.perm[X + 1 + this.perm[Y]];
        const bb = this.perm[X + 1 + this.perm[Y + 1]];

        const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
        const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);
        // normalize to [0, 1]
        return (this.lerp(x1, x2, v) + 1) * 0.5;
    }
}

const W = 355;
const H = 100;
const perlin = new Perlin2D(1999); // seed

const heatmap: Array<number[]> = new Array(H);
for (let i = 0; i < H; i++) {
    heatmap[i] = new Array(W);
}

// instead of x*0.02 … use circular coords:
const ANGULAR_SCALE = 0.3; // tweak to stretch/shrink features around the circle
const DEPTH_SCALE = 0.02; // your existing “forward” scale
const TWO_PI = Math.PI * 2;

function fillInitial() {
    for (let y = 0; y < H; y++) {
        const depth = y * DEPTH_SCALE;
        for (let i = 0; i < W; i++) {
            const theta = (i / W) * TWO_PI;
            const nx = Math.cos(theta) * ANGULAR_SCALE;
            const ny = Math.sin(theta) * ANGULAR_SCALE;
            heatmap[y][i] = perlin.noise(nx + depth, ny + depth);
        }
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        padding: new Thickness(0, 60, 0, 0),
    });

    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRangeLimit: new NumberRange(0, H),
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        startAngle: Math.PI / 2, // start at 12 o'clock
    });
    sciChartSurface.yAxes.add(radialAxis);

    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        flippedCoordinates: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        totalAngle: Math.PI * 2, // full circle
        startAngle: Math.PI / 2, // start at 12 o'clock
    });
    sciChartSurface.xAxes.add(angularAxis);

    // 3.3 Prepare & define dataSeries
    fillInitial();
    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: heatmap,
    });

    const heatmapSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        dataSeries,
        colorMap: COLOR_MAP,
        stroke: "white",
        strokeThickness: 2,
    });
    sciChartSurface.renderableSeries.add(heatmapSeries);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    // 3.4 Animate
    let vY = H; // virtual y‐coordinate of next row
    const speed = 1; // rows per frame

    const addNewRow = () => {
        const row = new Array<number>(W);
        const depth = vY * DEPTH_SCALE;

        for (let i = 0; i < W; i++) {
            const theta = (i / W) * TWO_PI;
            const nx = Math.cos(theta) * ANGULAR_SCALE;
            const ny = Math.sin(theta) * ANGULAR_SCALE;
            row[i] = perlin.noise(nx + depth, ny + depth);
        }
        vY += speed;

        heatmap.pop();
        heatmap.unshift(row);
        dataSeries.setZValues(heatmap);
    };

    const changeHeatmapFully = () => {
        for (let y = 0; y < H; y++) {
            const depth = y * DEPTH_SCALE;
            for (let i = 0; i < W; i++) {
                const theta = (i / W) * TWO_PI;
                const nx = Math.cos(theta) * ANGULAR_SCALE;
                const ny = Math.sin(theta) * ANGULAR_SCALE;
                heatmap[y][i] = perlin.noise(nx + depth, ny + depth + Math.random() * 0.1);
            }
        }
        dataSeries.setZValues(heatmap);
    };

    const animate = () => {
        addNewRow();
        // changeHeatmapFully();

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return { sciChartSurface, wasmContext };
};

export const drawHeatmapLegend = async (rootElement: string | HTMLDivElement) => {
    const { heatmapLegend } = await HeatmapLegend.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: { fontSize: 14, color: appTheme.ForegroundColor },
            axisBorder: { borderRight: 2, color: appTheme.ForegroundColor },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 8,
                strokeThickness: 2,
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 4,
                strokeThickness: 1,
            },
        },
        colorMap: COLOR_MAP,
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};
