import * as SciChart from "scichart";

async function drawExample(divElementId) {
    // Demonstrates how to configure chart titles SciChart.js
    const { SciChartSurface, NumericAxis, ZoomPanModifier, CursorModifier, FastLineRenderableSeries, XyDataSeries } =
        SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                dataSeriesName: "Line Series",
                xValues: [0, 10, 13, 15, 17, 18, 19, 20, 26],
                yValues: [0, 1, 5, 1, 5, 1, 8, 9, 3],
                dataIsSortedInX: false
            })
        })
    );

    class CustomZoomPanModifier extends ZoomPanModifier {
        getIsActionAllowed(args) {
            const isTouchEvent = args.pointerType === "touch" || args.pointerType === "pen";
            return (!isTouchEvent || this.activePointerEvents.size > 1) && super.getIsActionAllowed(args);
        }
    }

    class CustomCursorModifier extends CursorModifier {
        getIsActionAllowed(args) {
            const isTouchEvent = args.pointerType === "touch" || args.pointerType === "pen";
            return (!isTouchEvent || this.activePointerEvents.size === 1) && super.getIsActionAllowed(args);
        }
    }

    sciChartSurface.chartModifiers.add(new CustomZoomPanModifier(), new CustomCursorModifier());
}

drawExample("scichart-root");
