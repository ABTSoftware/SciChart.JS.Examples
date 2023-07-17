// #region ExampleA
const {
  DateLabelProvider
} = SciChart;

// A custom class which inherits DateLabelProvider for dynamic date/time formatting
// You can also inherit NumericLabelProvider for number formatting
class DynamicDateLabelProvider extends DateLabelProvider {

  // Different thesholds of axis.visibleRange.max - min to trigger format changes
  SECONDS_IN_DAY = 86400;
  SECONDS_IN_HOUR = 60 * 60 * 6;
  SECONDS_IN_MINUTE = 60 * 30;

  constructor() {
    super();
    // Disable caching due to dynamic nature of the labels
    this.useCache = false;
  }

  // Called for each label
  formatLabel(dataValue) {
    const axisRange = this.parentAxis.visibleRange;
    // assuming label dataValue is a unix timestamp / 1000 (attached to Date axis)
    const unixTimeStamp = dataValue;
    const date = new Date(unixTimeStamp * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    const hoursString = hours <= 9 ? `0${hours}` : hours.toString(10);
    const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString(10);
    const secondsString = seconds <= 9 ? `0${seconds}` : seconds.toString(10);

    if (axisRange.max - axisRange.min < this.SECONDS_IN_MINUTE) {
      // Format as 00m00s 000ms
      const millisecondsString = `00` + milliseconds.toString(10);
      return `${minutesString}m${secondsString}s ${millisecondsString}ms`;
    }
    else if (axisRange.max - axisRange.min < this.SECONDS_IN_HOUR) {
      // Format as HH:MM:SS
      return `${hoursString}:${minutesString}:${secondsString}`;
    } else if (axisRange.max - axisRange.min < this.SECONDS_IN_DAY) {
      // Format as HH:MM
      return `${hoursString}:${minutesString}`;
    } else {
      // Format as DD:MM:YY
      return date.toLocaleDateString("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
      });
    }
  }

  // Called for each tooltip/cursor label
  formatCursorLabel(dataValue) {
    return this.formatLabel(dataValue);
  }
}
// #endregion

async function labelProviderClass(divElementId) {
  const {
    SciChartSurface,
    DateTimeNumericAxis,
    NumericAxis,
    SciChartJsNavyTheme,
    NumberRange,
    TextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ZoomPanModifier,
    MouseWheelZoomModifier
  } = SciChart;

  const addChartTitle = (sciChartSurface, titleText, subTitleText) => {
    // Note: we will be improving this shortly in scichart.js v3.1
    sciChartSurface.annotations.add(new TextAnnotation({
      text: titleText,
      x1: 0.5, y1: 0.5,
      yCoordShift: -50,
      xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      opacity: 0.5,
      fontSize: 32,
      fontWeight: "Bold",
      textColor: "White",
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
      text: subTitleText,
      x1: 0.5, y1: 0.5,
      xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      opacity: 0.4,
      fontSize: 17,
      textColor: "White",
    }));
  };

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });

  addChartTitle(sciChartSurface, "Custom LabelProvider Class Example", "Zoom in using MouseWheel to see dynamic label formatting");
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis" }));

  // #region ExampleB

  const minDate = new Date("2023-03-01");
  const maxDate = new Date("2023-03-03");

  const xAxis = new DateTimeNumericAxis(wasmContext, {
    axisTitle: "X Axis with custom LabelProvider",
    // Note see DateTimeNumericAxis docs about unix timestamps / 1000
    visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
    // Apply the custom labelprovider we created before
    labelProvider: new DynamicDateLabelProvider()
  });
  sciChartSurface.xAxes.add(xAxis);
  // #endregion

  // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
};

labelProviderClass("scichart-root");





async function builderExample(divElementId) {
  const {
    chartBuilder,
    EThemeProviderType,
    NumberRange,
    EAxisType,
    EChart2DModifierType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const minDate = new Date("2023-03-01");
  const maxDate = new Date("2023-03-03");

  // #region ExampleC
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        axisTitle: "X Axis with custom LabelProvider",
        // Note see DateTimeNumericAxis docs about unix timestamps / 1000
        visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
        // Apply the custom labelprovider we created before
        labelProvider: new DynamicDateLabelProvider()
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
    },
    modifiers: [
      { type: EChart2DModifierType.MouseWheelZoom }
    ]
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");

