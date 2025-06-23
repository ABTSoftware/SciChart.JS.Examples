import {
  SciChartSurface,
  NumericAxis,
  NumberRange,
  EAxisAlignment,
  XyDataSeries,
  FastLineRenderableSeries,
  FastMountainRenderableSeries,
  ZoomPanModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  SciChartVerticalGroup,
  RolloverModifier,
  EAutoRange,
} from "scichart";

async function initSciChart() {
  // #region ExampleA

  // CREATE FIRST CHART
  const createFirstChart = async () => {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.

    // Create the first chart
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
      "scichart-root-1"
    );

    // Create an X Axis and add to the chart
    sciChartSurface.xAxes.add(
      new NumericAxis(wasmContext, { axisTitle: "X Axis" })
    );

    // Create Y Axis and add to the chart
    sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, {
        axisTitle: "Y Axis",
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.2, 0.2),
      })
    );

    // Create data for line series
    const dataForLineSeries = new XyDataSeries(wasmContext);
    for (let x = 0; x < 250; x++) {
      dataForLineSeries.append(x, Math.sin(x * 0.1));
    }

    // Create line series and add to the chart
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      dataSeries: dataForLineSeries,
    });
    lineSeries.rolloverModifierProps.tooltipColor = "green";
    lineSeries.rolloverModifierProps.tooltipLabelX = "X";
    lineSeries.rolloverModifierProps.tooltipLabelY = "Y";
    sciChartSurface.renderableSeries.add(lineSeries);

    sciChartSurface.chartModifiers.add(
      new ZoomPanModifier(),
      new MouseWheelZoomModifier(),
      new ZoomExtentsModifier(),
      new RolloverModifier()
    );
    return { sciChartSurface };
  };
  // createFirstChart();
  // #endregion

  // #region ExampleB

  // CREATE SECOND CHART
  const createSecondChart = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
      "scichart-root-2"
    );

    // Create an X Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));

    // Create Y Axis and add to the chart
    sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, {
        axisTitle: "Y Axis",
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.2, 0.2),
      })
    );

    // Create data for mountain series
    const dataForMountainSeries = new XyDataSeries(wasmContext);
    for (let x = 0; x < 250; x++) {
      dataForMountainSeries.append(x, Math.cos(x * 0.1));
    }

    // Don't forget to
    // import { FastMountainRenderableSeries } from "scichart";

    // Create mountain series, bind to primary axis and add to the chart
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
      dataSeries: dataForMountainSeries,
      fill: "LightSteelBlue",
    });
    mountainSeries.rolloverModifierProps.tooltipColor = "green";
    sciChartSurface.renderableSeries.add(mountainSeries);

    sciChartSurface.chartModifiers.add(
      new ZoomPanModifier(),
      new MouseWheelZoomModifier(),
      new ZoomExtentsModifier(),
      new RolloverModifier()
    );

    return { sciChartSurface };
  };
  // createSecondChart();
  // #endregion

  // #region ExampleC

  // Creation of charts. Given the functions createFirstChart() and createSecondChart() return promises,
  // we await both.
  const res = await Promise.all([createFirstChart(), createSecondChart()]);

  // Both functions return a promise of { sciChartSurface } so we can access the chart instances as follows
  const allCharts = res.map((r) => r.sciChartSurface);
  const [scs0, scs1] = allCharts;

  // Now we can access chart properties, such as XAxis, YAxis, RenderableSeries, Annotations, etc.
  const [xAxis0, xAxis1] = allCharts.map((scs) => scs.xAxes.get(0));

  // To Synchronize two charts

  // Synchronize visible ranges. When one chart xAxis.visibleRange changes, update the other
  xAxis0.visibleRangeChanged.subscribe((data1) => {
    xAxis1.visibleRange = data1.visibleRange;
  });
  xAxis1.visibleRangeChanged.subscribe((data1) => {
    xAxis0.visibleRange = data1.visibleRange;
  });

  // #endregion

  // #region ExampleD

  // Synchronize the chart axis sizes uses SciChartVerticalGroup
  // This is useful in case the Y-axis have different sizes due to differing visibleRange
  // text formatting or size
  const verticalGroup = new SciChartVerticalGroup();
  verticalGroup.addSurfaceToGroup(scs0);
  verticalGroup.addSurfaceToGroup(scs1);

  // #endregion

  // #region ExampleE

  // For each chart modifier on both charts, set the modifierGroup. This
  // ensures that mouse events which occur on one chart are sent to the other
  scs0.chartModifiers.asArray().forEach((m) => (m.modifierGroup = "MyGroup"));
  scs1.chartModifiers.asArray().forEach((m) => (m.modifierGroup = "MyGroup"));

  // #endregion
}

initSciChart();
