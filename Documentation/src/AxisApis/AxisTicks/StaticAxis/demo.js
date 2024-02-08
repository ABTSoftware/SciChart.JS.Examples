
async function staticAxis(divElementId) {
  // #region ExampleA
  // Demonstrates how to configure a chart with Static Axis in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // Adjust major/minor gridline style to make it clearer for the demo
  const styleOptions = {
    majorGridLineStyle: { color: "#50C7E077"},
    minorGridLineStyle: { color: "#50C7E033"},
  };

  const xAxis = new NumericAxis(wasmContext, {
    axisTitle: "XAxis.isStaticAxis = true",
    isStaticAxis: true,
    ...styleOptions
  });

  const yAxis = new NumericAxis(wasmContext, {
    axisTitle: "yAxis.isStaticAxis = false",
    ...styleOptions
  });

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);
  // #endregion

  // Add zoom pan behaviour and an annotation instructing user to pan the chart
  const { TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
  const options = {
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    x1: 0.5,
    y1: 0.5,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    opacity: 0.33,
    textColor: "White",
  };
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Static Axis Example",
    fontSize: 36,
    yCoordShift: -125,
    ... options,
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Drag to pan the chart to see xAxis.isStaticAxis behaviour",
    fontSize: 20,
    yCoordShift: -75,
    ... options,
  }));

  const { FastLineRenderableSeries, XyDataSeries } = SciChart;
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, { xValues: [1, 2, 3, 4, 5], yValues: [1, 2, 1, 2, 1] }),
    stroke: "#FF6600",
    strokeThickness: 3,
  }));

  const { ZoomPanModifier, EXyDirection } = SciChart;
  sciChartSurface.chartModifiers.add(new ZoomPanModifier( { xyDirection: EXyDirection.XDirection }));
};

staticAxis("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleB
  // Demonstrates how to configure a chart with Static Axis in SciChart.js
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "XAxis.isStaticAxis = true",
        isStaticAxis: true,
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "yAxis.isStaticAxis = false",
      }
    },
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
