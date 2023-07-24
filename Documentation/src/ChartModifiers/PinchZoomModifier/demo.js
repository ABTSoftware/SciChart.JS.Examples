async function drawExample(divElementId) {
    // #region ExampleA
    // Demonstrates how to configure chart titles SciChart.js
    const { SciChartSurface, NumericAxis, PinchZoomModifier } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
        divElementId
    );

    // Create an X and Y Axis with title
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { id: "xAxis1", axisTitle: "xAxis1" })
    );
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { id: "xAxis2", axisTitle: "xAxis2" })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "yAxis1", axisTitle: "yAxis1" })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "yAxis2", axisTitle: "yAxis2" })
    );

    const pinchZoomModifier = new PinchZoomModifier({
        horizontalGrowFactor: 0.001,
        verticalGrowFactor: 0.001,
        excludedXAxisIds: ["xAxis2"],
        includedYAxisIds: ["yAxis1"],
    });

    sciChartSurface.chartModifiers.add(pinchZoomModifier);
    // #endregion
}

drawExample("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to configure chart titles in SciChart.js using the Builder API
    const { chartBuilder, EAxisType, EChart2DModifierType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
        divElementId,
        {
            xAxes: [
                {
                    type: EAxisType.NumericAxis,
                    options: { id: "xAxis1", axisTitle: "xAxis1" },
                },
                {
                    type: EAxisType.NumericAxis,
                    options: { id: "xAxis2", axisTitle: "xAxis2" },
                },
            ],
            yAxes: [
                {
                    type: EAxisType.NumericAxis,
                    options: { id: "yAxis1", axisTitle: "yAxis1" },
                },
                {
                    type: EAxisType.NumericAxis,
                    options: { id: "yAxis2", axisTitle: "yAxis2" },
                },
            ],
            modifiers: [
                {
                    type: EChart2DModifierType.PinchZoom,
                    options: {
                        horizontalGrowFactor: 0.001,
                        verticalGrowFactor: 0.001,
                        excludedXAxisIds: ["xAxis2"],
                        includedYAxisIds: ["yAxis1"],
                    },
                },
            ],
        }
    );
    // #endregion
}

if (location.search.includes("builder=1")) drawExample("scichart-root");
