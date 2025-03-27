// #region ExampleA
const { RolloverModifier, EMousePosition, Point, translateFromSeriesViewRectToCanvas } = SciChart;

// or for npm import { RolloverModifier } from "scichart"

// Workaround for programmatically placing a RolloverModifier at a specific location
class CustomPlacementRollover extends RolloverModifier {
    constructor() {
        super();
    }

    // do nothing (disable default behavior)
    modifierMouseMove(e) {}
    modifierMouseLeave(e) {}

    onParentSurfaceRendered() {
        const xAxis = this.parentSurface?.xAxes?.getById(this.xAxisId);
        if (xAxis && this.xValue && this.parentSurface?.seriesViewRect) {
            // Convert xValue from data to coordinate.
            const xCoord = xAxis.getCurrentCoordinateCalculator()?.getCoordinate(this.xValue);
            // Translate from the seriesViewRect back to the parent canvas (rollover expects coords in this space)
            const hackedMousePoint = translateFromSeriesViewRectToCanvas(
                new Point(xCoord, 0),
                this.parentSurface.seriesViewRect
            );
            // Simulate rollover at x,y coord
            console.log(`Simulating a mouse move to (x,y) = ${hackedMousePoint?.toString()}`);
            super.modifierMouseMove({ mousePoint: hackedMousePoint });
        }

        super.onParentSurfaceRendered();
    }

    setXValue(xValue) {
        console.log(`Setting XValue to ${xValue}`);
        this.xValue = xValue;
    }
}
// #endregion

async function rolloverProgrammaticPlacement(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        NumberRange,
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // #region ExampleB
    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Place Rollover at X=10 on a dynamic chart",
        titleStyle: { fontSize: 16 },
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "X Axis" }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { visibleRange: new NumberRange(-2, 0.5), axisTitle: "Y Axis" })
    );

    // Add a RolloverModifier with custom placement at X=10
    const rollover = new CustomPlacementRollover();
    rollover.setXValue(10);
    sciChartSurface.chartModifiers.add(rollover);

    // #endregion
    // Create a DataSeries
    const xyDataSeries = new XyDataSeries(wasmContext, {
        // Optional: pass X,Y values to DataSeries constructor for fast initialization
        xValues: [],
        yValues: [],
    });

    // Create a renderableSeries and assign the dataSeries
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries,
            strokeThickness: 3,
            stroke: "#50C7E0",
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

rolloverProgrammaticPlacement("scichart-root");
