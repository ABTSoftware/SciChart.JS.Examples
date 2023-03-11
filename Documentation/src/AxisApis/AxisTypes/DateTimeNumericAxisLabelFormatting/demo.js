async function labelFormattingWithDateTimeNumericAxis(divElementId) {
  // Demonstrates how to configure a DateTimeNumericAxis in SciChart.js
  const {
    SciChartSurface,
    DateTimeNumericAxis,
    SciChartJsNavyTheme,
    NumberRange,
    EAxisAlignment,
    NumericAxis,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ENumericFormat
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // #region ExampleA
  // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-10");

  // Create the axis. SmartDateLabelProvider is automatically applied to labelProvider property
  const xAxis = new DateTimeNumericAxis(wasmContext, {
    axisTitle: "X Axis / DateTime",
    // We need to specify some visibleRange to see these two dates
    // SciChart.js expects linux timestamp / 1000
    visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
  });

  // labelProvider is type SmartDateLabelProvider for this axis type
  const labelProvider = xAxis.labelProvider;

  // when true first label should be formatted using the wider format (eg Month Day).
  // when false the wider format will only be used when it changes (eg day/month boundary)
  labelProvider.showWiderDateOnFirstLabel = false;

  labelProvider.rotation = -45;

  labelProvider.labelFormat

  // Add the xAxis to the chart
  sciChartSurface.xAxes.add(xAxis);
  // #endregion

  // Creating a NumericAxis as a YAxis on the left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Y Axis, Numeric",
    axisAlignment: EAxisAlignment.Left,
  }));

  // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());

  // Add annotations to tell the user what to do
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Custom Date Formatting",
    x1: 0.5, y1: 0.5,
    yCoordShift: 0,
    xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
    opacity: 0.33,
    fontSize: 36,
    fontWeight: "Bold"
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Try mouse-wheel, left/right mouse drag and notice the dynamic X-Axis Labels",
    x1: 0.5, y1: 0.5,
    yCoordShift: 50,
    xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
    opacity: 0.45,
    fontSize: 17,
  }));
};

labelFormattingWithDateTimeNumericAxis("scichart-root");





async function builderExample(divElementId) {
  // Demonstrates how to create a line chart with SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    NumberRange,
    EAxisAlignment,
    EAxisType,
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-10");

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.DateTimeNumericAxis,
      options: {
        axisTitle: "X Axis / DateTime",
        // We need to specify some visibleRange to see these two dates
        // SciChart.js expects linux timestamp / 1000
        visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
      }
    },
    // ... });
    // #endregion
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis, Left, default formatting",
        axisAlignment: EAxisAlignment.Left,
      }
    },
  });
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
