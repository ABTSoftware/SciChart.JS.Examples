async function chartWithCategoryAxis(divElementId) {
  // Demonstrates how to configure a DateTimeNumericAxis in SciChart.js
  const {
    SciChartSurface,
    CategoryAxis,
    SciChartJsNavyTheme,
    EAxisAlignment,
    NumericAxis,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // #region ExampleA
  // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-10");

  // Unix Epoch for March 1st 2022 & March 2nd
  const march1st2023 = new Date("2023-03-1");
  const march2nd2023 = new Date("2023-03-10");
  const oneDay = march2nd2023 - march1st2023;

  // Creating a CategoryAxis as an XAxis on the bottom
  sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, {
    // set Defaults so that category axis can draw. Once you add series and data these will be overridden
    defaultXStart: march1st2023,
    defaultXStep: oneDay,
    // set other properties
    drawMajorGridLines: true,
    drawMinorGridLines: true,
    axisTitle: "Category X Axis",
    axisAlignment: EAxisAlignment.Bottom,
    // set a date format for labels
    labelFormat: ENumericFormat.Date_DDMMYYYY
  }));

  // Create a YAxis on the left
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
    axisTitle: "Numeric Y Axis",
    axisAlignment: EAxisAlignment.Left,
  }));

  // #endregion

  // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());

  // Add annotations to tell the user what to do
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "CategoryAxis Demo",
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

chartWithCategoryAxis("scichart-root");





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
