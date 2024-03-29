import { appTheme } from "scichart-example-dependencies";
import {
    SciChartSurface,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    XyDataSeries,
    NumericAxis,
    FastMountainRenderableSeries,
    NumberRange,
    EAutoRange,
    EXyDirection,
    EAxisAlignment,
} from "scichart";
import { DepthCursorModifier } from "./DepthCursorModifier";
// SCICHART EXAMPLE
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const xAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        labelPrecision: 4,
        rotation: 90,
    });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0, 0.05),
    });
    sciChartSurface.yAxes.add(yAxis);
    const AAPL_data = {
        buy: [
            { price: 132.79743, volume: 339 },
            { price: 132.79742, volume: 713 },
            { price: 132.79741, volume: 421 },
            { price: 132.7974, volume: 853 },
            { price: 132.79739, volume: 152 },
            { price: 132.79738, volume: 243 },
            { price: 132.79737, volume: 296 },
            { price: 132.79736, volume: 123 },
            { price: 132.79735, volume: 158 },
            { price: 132.79734, volume: 238 },
            { price: 132.79733, volume: 164 },
            { price: 132.79732, volume: 273 },
            { price: 132.79731, volume: 35 },
            { price: 132.79729, volume: 30 },
            { price: 132.79726, volume: 29 },
            { price: 132.79722, volume: 484 },
            { price: 132.79721, volume: 458 },
            { price: 132.7972, volume: 244 },
            { price: 132.79719, volume: 10 },
            { price: 132.79698, volume: 124 },
        ],
        sell: [
            { price: 132.79744, volume: 847 },
            { price: 132.79745, volume: 2412 },
            { price: 132.79746, volume: 635 },
            { price: 132.79747, volume: 323 },
            { price: 132.79748, volume: 828 },
            { price: 132.79749, volume: 322 },
            { price: 132.7975, volume: 268 },
            { price: 132.79751, volume: 92 },
            { price: 132.79752, volume: 249 },
            { price: 132.79753, volume: 189 },
            { price: 132.79754, volume: 179 },
            { price: 132.79755, volume: 122 },
            { price: 132.79756, volume: 28 },
            { price: 132.7976, volume: 114 },
            { price: 132.79764, volume: 27 },
            { price: 132.79767, volume: 10 },
            { price: 132.79772, volume: 31 },
            { price: 132.79785, volume: 484 },
            { price: 132.79786, volume: 364 },
            { price: 132.79787, volume: 244 },
        ],
    };
    const buyValues = [];
    let totalVol = 0;
    for (const v of AAPL_data.buy) {
        totalVol += v.volume;
        buyValues.push(totalVol);
    }
    const sellValues = [];
    totalVol = 0;
    for (const v of AAPL_data.sell) {
        totalVol += v.volume;
        sellValues.push(totalVol);
    }
    const buySeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: AAPL_data.buy.map((v) => v.price), yValues: buyValues }),
        stroke: "green",
        fill: "00890033",
        strokeThickness: 2,
        isDigitalLine: true,
    });
    const sellSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: AAPL_data.sell.map((v) => v.price), yValues: sellValues }),
        stroke: "red",
        fill: "89000033",
        strokeThickness: 2,
        isDigitalLine: true,
    });
    sciChartSurface.renderableSeries.add(buySeries, sellSeries);
    xAxis.tickProvider.getMajorTicks = (minor, major, visibleRange) => {
        const ticks = [];
        const threshold = 400;
        const buyYs = buySeries.dataSeries.getNativeYValues();
        const buyXs = buySeries.dataSeries.getNativeXValues();
        let lastY = 0;
        for (let i = 0; i < buySeries.dataSeries.count(); i++) {
            const y = buyYs.get(i);
            if (y - lastY > threshold) {
                ticks.push(buyXs.get(i));
            }
            lastY = y;
        }
        const sellYs = sellSeries.dataSeries.getNativeYValues();
        const sellXs = sellSeries.dataSeries.getNativeXValues();
        lastY = 0;
        for (let i = 0; i < sellSeries.dataSeries.count(); i++) {
            const y = sellYs.get(i);
            if (y - lastY > threshold) {
                ticks.push(sellXs.get(i));
            }
            lastY = y;
        }
        return ticks.sort((a, b) => a - b);
    };
    const depthModifier = new DepthCursorModifier({
        buySeries,
        sellSeries,
        crosshairStrokeDashArray: [3, 2],
        crosshairStrokeThickness: 3,
        axisLabelFill: "transparent",
    });
    depthModifier.highlightColor = appTheme.DarkIndigo;
    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        depthModifier
    );
    sciChartSurface.zoomExtents();
    xAxis.visibleRangeLimit = xAxis.visibleRange;
    yAxis.visibleRangeLimit = yAxis.visibleRange;
    return { sciChartSurface };
};
