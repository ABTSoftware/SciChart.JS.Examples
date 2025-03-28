import * as SciChart from "scichart";

// #region ExampleA
const { RolloverModifier } = SciChart;

// or for npm import { RolloverModifier } from "scichart"

// Workaround for placing a RolloverModifier on CTRL+Click
// Clicking without CTRL will hide the rollover
class RolloverPlacedOnClick extends RolloverModifier {
    constructor() {
        super();
    }

    // do nothing (disable default behavior)
    modifierMouseMove(e) {}
    modifierMouseLeave(e) {}

    modifierMouseDown(e) {
        if (e.ctrlKey) {
            console.log(`RolloverModifier clicked at ${e.mousePoint.x}, ${e.mousePoint.y}`);
            super.modifierMouseMove(e);
        } else {
            console.log(`hiding rollover`);
            super.modifierMouseLeave(e);
        }
    }
}
// #endregion

async function rolloverPlacementOnClick(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        NumberRange
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleB
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Place Rollover and persist on CTRL+Click",
        titleStyle: { fontSize: 16 }
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { visibleRange: new NumberRange(-2, 0.5), axisTitle: "Y Axis" })
    );

    // Add a RolloverModifier with placement on CTRL+CLICK
    const rollover = new RolloverPlacedOnClick();
    sciChartSurface.chartModifiers.add(rollover);

    // #endregion
    // Create a DataSeries
    const xyDataSeries = new XyDataSeries(wasmContext, {
        // Optional: pass X,Y values to DataSeries constructor for fast initialization
        xValues: [],
        yValues: []
    });

    // Create a renderableSeries and assign the dataSeries
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries,
            strokeThickness: 3,
            stroke: "#50C7E0"
        })
    );

    // Now let's use a timeout to clear() and appendRange() entirely new values every 20ms.
    const updateCallback = () => {
        const xValues = [];
        const yValues = [];
        for (let i = 0; i < 100; i++) {
            xValues.push(i);
            yValues.push(Math.random() * Math.sin(i * 0.1) - Math.cos(i * 0.01));
        }
        xyDataSeries.clear();
        xyDataSeries.appendRange(xValues, yValues);
    };

    setTimeout(() => {
        updateCallback();
        setInterval(updateCallback, 500);
    }, 20);
}

rolloverPlacementOnClick("scichart-root");
