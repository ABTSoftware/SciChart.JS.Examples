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
    ENumericFormat,
    DateLabelProvider
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  // #region ExampleA
  // If you want to show an XAxis with custom label formats
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-3");

  // Create the axis. SmartDateLabelProvider is automatically applied to labelProvider property
  const xAxis = new DateTimeNumericAxis(wasmContext, {
    axisTitle: "X Axis / DateTime",
    visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
    // Specify a DateLabelProvider with format to override the built-in behaviour
    labelProvider: new DateLabelProvider({ labelFormat: ENumericFormat.Date_DDMMYYYY })
  });

  // When zoomed in to less than one day, switch the date format
  xAxis.visibleRangeChanged.subscribe((arg) => {
    const SECONDS_IN_DAY = 86400;
    const SECONDS_IN_HOUR = 3600;
    if (arg.visibleRange.max - arg.visibleRange.min < SECONDS_IN_HOUR) {
      xAxis.labelProvider.numericFormat = ENumericFormat.Date_HHMMSS;
    } else if (arg.visibleRange.max - arg.visibleRange.min < SECONDS_IN_DAY) {
      xAxis.labelProvider.numericFormat = ENumericFormat.Date_HHMM;
    } else {
      xAxis.labelProvider.numericFormat = ENumericFormat.Date_DDMMYYYY;
    }
  });

  // Note other options include overriding labelProvider.formatLabel,
  // or custom labelproviders

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
    text: "Custom Date Format on Zoom",
    x1: 0.5, y1: 0.5,
    yCoordShift: 0,
    xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
    opacity: 0.33,
    fontSize: 36,
    fontWeight: "Bold"
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Zoom in using mousewheel to see the date format change",
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
    ENumericFormat,
    ELabelProviderType,
    EChart2DModifierType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  // If you want to show an XAxis with dates and dynamic label formats
  const minDate = new Date("2023-03-1");
  const maxDate = new Date("2023-03-3");

  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.DateTimeNumericAxis,
      options: {
        axisTitle: "X Axis / DateTime",
        // We need to specify some visibleRange to see these two dates
        // SciChart.js expects linux timestamp / 1000
        visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
        labelProvider: {
          type: ELabelProviderType.Date,
          options: {
            labelFormat: ENumericFormat.Date_DDMMYYYY
          }
        }
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "Y Axis, Left, default formatting",
        axisAlignment: EAxisAlignment.Left,
      }
    },
    modifiers: [
      { type: EChart2DModifierType.MouseWheelZoom }
    ]
  });

  const xAxis = sciChartSurface.xAxes.get(0);
  // When zoomed in to less than one day, switch the date format
  xAxis.visibleRangeChanged.subscribe((arg) => {
    const SECONDS_IN_DAY = 86400;
    const SECONDS_IN_HOUR = 3600;
    if (arg.visibleRange.max - arg.visibleRange.min < SECONDS_IN_HOUR) {
      xAxis.labelProvider.numericFormat = ENumericFormat.Date_HHMMSS;
    } else if (arg.visibleRange.max - arg.visibleRange.min < SECONDS_IN_DAY) {
      xAxis.labelProvider.numericFormat = ENumericFormat.Date_HHMM;
    } else {
      xAxis.labelProvider.numericFormat = ENumericFormat.Date_DDMMYYYY;
    }
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
