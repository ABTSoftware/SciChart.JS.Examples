const xValues = [];
const yValues = [];
const yValues1 = [];
for (let i = 0; i < 100; i++) {
  xValues.push(i);
  yValues.push(Math.random());
  yValues1.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
}

async function simpleSubChart(divElementId) {
  // #region ExampleA
  // Demonstrates the isTransparent property in SubCharts
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    Rect,
    ECoordinateMode,
    FastLineRenderableSeries,
    XyDataSeries,
    MouseWheelZoomModifier,
    ZoomPanModifier,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // Create a parent (regular) SciChartSurface which will contain the sub-chart
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
      title: "Parent Chart",
      titleStyle: { fontSize: 22, color: "#eeeeee" },
    }
  );

  // Create X,Y axis on the parent chart and programmatically zoom into part of the data
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Add some random data to the parent chart so it can be shown through the subchart
  sciChartSurface.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      strokeThickness: 3,
      stroke: "teal",
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    })
  );

  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
  sciChartSurface.chartModifiers.add(new ZoomPanModifier());

  // Add a Sub-Charts to the main surface with isTransparent=true
  const subChart1 = sciChartSurface.addSubChart({
    position: new Rect(0.02, 0.05, 0.4, 0.4),
    isTransparent: true,
    canvasBorder: { border: 3, color: "#77777777" },
    title: "SubChart with isTransparent True",
    titleStyle: { fontSize: 16, color: "#eeeeee99" },
  });

  // Add x,y axis to the subchart
  subChart1.xAxes.add(new NumericAxis(wasmContext));
  subChart1.yAxes.add(new NumericAxis(wasmContext));

  // Add some random data to the sub chart so it can be shown through the subchart
  subChart1.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      strokeThickness: 5,
      stroke: "Orange",
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1 }),
    })
  );

  // Add a Sub-Charts to the main surface with isTransparent=false
  const subChart2 = sciChartSurface.addSubChart({
    position: new Rect(0.02, 0.5, 0.4, 0.4),
    isTransparent: false,
    canvasBorder: { border: 3, color: "#77777777" },
    title: "SubChart with isTransparent false",
    titleStyle: { fontSize: 16, color: "#eeeeee99" },
  });

  // Add x,y axis to the subchart
  subChart2.xAxes.add(new NumericAxis(wasmContext));
  subChart2.yAxes.add(new NumericAxis(wasmContext));

  // Add some random data to the sub chart so it can be shown through the subchart
  subChart2.renderableSeries.add(
    new FastLineRenderableSeries(wasmContext, {
      strokeThickness: 5,
      stroke: "Orange",
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: yValues1 }),
    })
  );
  // #endregion
}

simpleSubChart("scichart-root");

async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    ESeriesType,
    EAxisType,
    EThemeProviderType,
    Rect,
    ECoordinateMode,
    EAnnotationType,
    NumberRange,
    EChart2DModifierType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: { theme: { type: EThemeProviderType.Dark } },
      // Main chart definition is here
      xAxes: { type: EAxisType.NumericAxis },
      yAxes: { type: EAxisType.NumericAxis },
      series: [
        {
          type: ESeriesType.LineSeries,
          xyData: {
            xValues,
            yValues,
          },
          options: {
            stroke: "#0066FF",
            strokeThickness: 5,
          },
        },
      ],
      modifiers: [
        { type: EChart2DModifierType.ZoomPan },
        { type: EChart2DModifierType.ZoomExtents },
        { type: EChart2DModifierType.MouseWheelZoom },
      ],
      // Subchart definition is here
      subCharts: [
        {
          surface: {
            position: new Rect(0.02, 0.05, 0.4, 0.4),
            isTransparent: true,
            canvasBorder: { border: 3, color: "#77777777" },
            title: "SubChart with isTransparent True",
            titleStyle: { fontSize: 16, color: "#eeeeee99" },
          },
          // Define the x,y axis on Subchart
          xAxes: { type: EAxisType.NumericAxis },
          yAxes: { type: EAxisType.NumericAxis },
          // Define the series on Subchart
          series: [
            {
              type: ESeriesType.LineSeries,
              xyData: {
                xValues,
                yValues: yValues1,
              },
              options: {
                stroke: "#0066FF",
                strokeThickness: 5,
              },
            },
          ],
        },
        {
          surface: {
            position: new Rect(0.02, 0.5, 0.4, 0.4),
            isTransparent: false,
            canvasBorder: { border: 3, color: "#77777777" },
            title: "SubChart with isTransparent false",
            titleStyle: { fontSize: 16, color: "#eeeeee99" },
          },
          // Define the x,y axis on Subchart
          xAxes: { type: EAxisType.NumericAxis },
          yAxes: { type: EAxisType.NumericAxis },
          // Define the series on Subchart
          series: [
            {
              type: ESeriesType.LineSeries,
              xyData: {
                xValues,
                yValues: yValues1,
              },
              options: {
                stroke: "#0066FF",
                strokeThickness: 5,
              },
            },
          ],
        },
      ],
    }
  );
  // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
