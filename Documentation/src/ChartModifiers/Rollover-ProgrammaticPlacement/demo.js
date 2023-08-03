// #region ExampleA
const { RolloverModifier, EMousePosition, Point } = SciChart;

// or for npm import { RolloverModifier } from "scichart"

// Workaround for programmatically placing a RolloverModifier at a specific location
class CustomPlacementRollover extends RolloverModifier {
  constructor(xValue) {
    super();

    this.setXValue(xValue);
  }
  modifierMouseMove(e) {
    // do nothing (disable default behavior)
  }

  onAttach() {
    super.onAttach();
    this.updatePosition();
  }

  setXValue(xValue) {
    console.log(`Setting XValue to ${xValue}`);
    this.xValue = xValue;
    this.updatePosition();
  }

  updatePosition() {
    // Find the xAxis on parent chart by id
    const xAxis = this.parentSurface?.xAxes?.getById(this.xAxisId);
    if (xAxis) {
      // Convert xValue from data to coordinate. Set this on the base class mousePoint property to force rollover to appear
      // at this pixel value
      const hackedMousePoint = new Point(xAxis.getCurrentCoordinateCalculator()?.getCoordinate(this.xValue), 10);
      console.log(`Setting MousePoint to ${hackedMousePoint.toString()}`);
      super.modifierMouseMove({ mousePoint: hackedMousePoint });
    }
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
    titleStyle: { fontSize: 16 }
  });

  // For the example to work, axis must have EAutoRange.Always
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "X Axis" }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-2, 0.5), axisTitle: "Y Axis" }));

  // Add a RolloverModifier with custom placement at X=10
  const rollover = new CustomPlacementRollover(5);
  sciChartSurface.chartModifiers.add(rollover);

  // #endregion
  // Create a DataSeries
  const xyDataSeries = new XyDataSeries(wasmContext, {
    // Optional: pass X,Y values to DataSeries constructor for fast initialization
    xValues: [],
    yValues: []
  });

  // Create a renderableSeries and assign the dataSeries
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries: xyDataSeries,
    strokeThickness: 3,
    stroke: "#50C7E0"
  }));

  // Now let's use a timeout to clear() and appendRange() entirely new values every 20ms.
  const updateCallback = () => {
    const xValues = [];
    const yValues = [];
    for(let i = 0; i < 100; i++) {
      xValues.push(i);
      yValues.push(Math.random() * Math.sin(i*0.1) - Math.cos(i * 0.01));
    }
    xyDataSeries.clear();
    xyDataSeries.appendRange(xValues, yValues);
  }

  setTimeout(() => {
    updateCallback();
    setInterval(updateCallback, 20);
  }, 20);
}

rolloverProgrammaticPlacement("scichart-root");



