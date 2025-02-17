// #region ExampleA
// demonstrates how to create a reusable 1x2 panel of charts using SubCharts API
async function createThreePanelChart(divElementId) {
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    Rect,
    ZoomPanModifier,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  // Create a parent (regular) SciChartSurface which will contain the sub-chart
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Add a Sub-Charts to the main surface. This will display a rectangle showing the current zoomed in area on the parent chart

  // Top chart to occupy 100% of the width and 50% height
  const subChartTop = sciChartSurface.addSubChart({
    position: new Rect(0, 0, 1, 0.5),
    theme: new SciChartJsNavyTheme(),
    title: "Audio Chart",
    titleStyle: { fontSize: 14 },
  });

  // Bottom left chart to occupy 50% of the width and 50% height
  const subChartBottomLeft = sciChartSurface.addSubChart({
    position: new Rect(0, 0.5, 0.5, 0.5),
    theme: new SciChartJsNavyTheme(),
    title: "Frequency Chart",
    titleStyle: { fontSize: 14 },
  });

  const subChartBottomRight = sciChartSurface.addSubChart({
    position: new Rect(0.5, 0.5, 0.5, 0.5),
    theme: new SciChartJsNavyTheme(),
    title: "Spectrogram Chart",
    titleStyle: { fontSize: 14 },
  });

  // Add common axis, interactivity to all charts. Customize this as needed
  [subChartTop, subChartBottomLeft, subChartBottomRight].forEach((scs) => {
    scs.xAxes.add(
      new NumericAxis(wasmContext, {
        axisTitle: "XAxis",
        axisTitleStyle: { fontSize: 12 },
      })
    );
    scs.yAxes.add(
      new NumericAxis(wasmContext, {
        axisTitle: "YAxis",
        axisTitleStyle: { fontSize: 12 },
      })
    );
    scs.chartModifiers.add(new ZoomPanModifier());
  });

  // If you return the charts to the caller, you can now configure series, data and configure them
  return {
    sciChartSurface,
    subChartTop,
    subChartBottomLeft,
    subChartBottomRight,
  };
}

createThreePanelChart("scichart-root");
// #endregion

// #region ExampleB
// Demonstrates how to create a 1x2 panel of charts using SubCharts and the Builder API
async function builderExample(divElementId) {
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    EAxisType,
    EThemeProviderType,
    Rect,
    EChart2DModifierType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(
    divElementId,
    {
      surface: { theme: { type: EThemeProviderType.Dark } },
      // Main chart
      subCharts: [
        {
          surface: {
            position: new Rect(0, 0, 1, 0.5),
            title: "Audio Chart",
            titleStyle: { fontSize: 14 },
            theme: { type: EThemeProviderType.Dark },
          },
          xAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "XAxis", axisTitleStyle: { fontSize: 12 } },
          },
          yAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "YAxis", axisTitleStyle: { fontSize: 12 } },
          },
          modifiers: [{ type: EChart2DModifierType.ZoomPan }],
        },
        {
          surface: {
            position: new Rect(0, 0.5, 0.5, 0.5),
            title: "Frequency Chart",
            titleStyle: { fontSize: 14 },
            theme: { type: EThemeProviderType.Dark },
          },
          xAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "XAxis", axisTitleStyle: { fontSize: 12 } },
          },
          yAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "YAxis", axisTitleStyle: { fontSize: 12 } },
          },
          modifiers: [{ type: EChart2DModifierType.ZoomPan }],
        },
        {
          surface: {
            position: new Rect(0.5, 0.5, 0.5, 0.5),
            title: "Spectrogram Chart",
            titleStyle: { fontSize: 14 },
            theme: { type: EThemeProviderType.Dark },
          },
          xAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "XAxis", axisTitleStyle: { fontSize: 12 } },
          },
          yAxes: {
            type: EAxisType.NumericAxis,
            options: { axisTitle: "YAxis", axisTitleStyle: { fontSize: 12 } },
          },
          modifiers: [{ type: EChart2DModifierType.ZoomPan }],
        },
      ],
    }
  );

  return {
    sciChartSurface,
    subChartTop: sciChartSurface.subCharts.at(0),
    subChartBottomLeft: sciChartSurface.subCharts.at(1),
    subChartBottomRight: sciChartSurface.subCharts.at(2),
  };
}
// #endregion

if (location.search.includes("builder=1")) builderExample("scichart-root");
