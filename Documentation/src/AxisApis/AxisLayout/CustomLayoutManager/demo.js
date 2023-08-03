// #region ExampleA
// or for npm ... import { BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy } from "scichart";
const {
  BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy,
  BottomAlignedOuterAxisLayoutStrategy,
  getHorizontalAxisRequiredSize
} = SciChart;

// Example of creating a custom layout manager. First requested here https://www.scichart.com/questions/js/is-it-possible-to-create-two-xaxis-where-one-is-normal-and-the-other-one-is-horizontally-stacked-axis-layout
//
// Axis rendering  happens in 2 phases: measure & layout.
// Axis size and positioning is calculated by an axis layout strategy accordingly to the axisAlignment and isInner properties
// This custom Layout Strategy applies normal layout strategy to the first axis and the stacked strategy to the rest of bottom-aligned outer axes
class CustomAxisLayoutStrategy extends BottomAlignedOuterHorizontallyStackedAxisLayoutStrategy {

  constructor() {
    super();

    /** The strategy used for normal (non-stacked) layout */
    this.defaultBottomOuterAxisLayoutStrategy = new BottomAlignedOuterAxisLayoutStrategy();
  }

  // override measureAxes from the base class
  measureAxes(sciChartSurface,    chartLayoutState,    axes) {
    const [firstAxis, ...stackedAxes] = axes;
    // measure stacked axes and max height (stackedAreaSize) required by them
    super.measureAxes(sciChartSurface, chartLayoutState, stackedAxes);
    const stackedAreaSize = chartLayoutState.bottomOuterAreaSize;

    // measure first axis with the regular logic
    this.defaultBottomOuterAxisLayoutStrategy.measureAxes(
      sciChartSurface,
      chartLayoutState,
      [firstAxis]
    );

    // calculate height required by the first axis and then the total height
    const firstAxisSize = getHorizontalAxisRequiredSize(firstAxis.axisLayoutState);
    chartLayoutState.bottomOuterAreaSize = firstAxisSize + stackedAreaSize;
  }

  // Override layoutAxes from the base class
  layoutAxes(left, right, top, bottom, axes) {
    const [firstAxis, ...stackedAxes] = axes;
    // layout first axis with the regular logic
    this.defaultBottomOuterAxisLayoutStrategy.layoutAxes(
      left,
      top,
      right,
      bottom,
      [firstAxis]
    );

    // after the layout phase we get axis.viewRect which specifies size and position of an axis
    // and then we can layout rest of the axes with stacked strategy beneath it.
    super.layoutAxes(left, firstAxis.viewRect.bottom, right, bottom, stackedAxes);
  }
}
// #endregion

async function customLayoutManager(divElementId) {
  // #region ExampleB
  // Demonstrates how to apply a custom layout manager in SciChart.js
  const {
    SciChartSurface,
    NumericAxis,
    SciChartJsNavyTheme,
    ZoomPanModifier,
    PinchZoomModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier
  } = SciChart;

  // or, for npm, import { SciChartSurface, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme()
  });


  sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy = new CustomAxisLayoutStrategy();

  const ID_X_AXIS_1 = "xAxis1";
  const ID_X_AXIS_2 = "xAxis2";
  const ID_X_AXIS_3 = "xAxis3";
  const ID_X_AXIS_4 = "xAxis3";
  const ID_Y_AXIS_1 = "yAxis1";
  const options = { drawMajorBands: false, drawMajorGridLines: false, drawMinorGridLines: false };
  const xAxis1 = new NumericAxis(wasmContext, {
    id: ID_X_AXIS_1,
    axisTitle: ID_X_AXIS_1,
    drawMajorBands: true,
    drawMajorGridLines: true,
    drawMinorGridLines: true
  });
  const xAxis2 = new NumericAxis(wasmContext, {
    id: ID_X_AXIS_2,
    axisTitle: ID_X_AXIS_2,
    ...options
  });
  const xAxis3 = new NumericAxis(wasmContext, {
    id: ID_X_AXIS_3,
    axisTitle: ID_X_AXIS_3,
    ...options
  });
  const xAxis4 = new NumericAxis(wasmContext, {
    id: ID_X_AXIS_4,
    axisTitle: ID_X_AXIS_4,
    ...options
  });
  const yAxis1 = new NumericAxis(wasmContext, {
    id: ID_Y_AXIS_1,
    axisTitle: ID_Y_AXIS_1
  });

  sciChartSurface.xAxes.add(xAxis1, xAxis2, xAxis3, xAxis4);
  sciChartSurface.yAxes.add(yAxis1);

  sciChartSurface.chartModifiers.add(
    new ZoomPanModifier(),
    new PinchZoomModifier(),
    new ZoomExtentsModifier(),
    new MouseWheelZoomModifier({ applyToSeriesViewRect: false })
  );
  // #endregion
};

customLayoutManager("scichart-root");





async function builderExample(divElementId) {
  // #region ExampleC
  // Demonstrates how to apply a custom layout manager in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    ELayoutManagerType
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: {
        theme: { type: EThemeProviderType.Dark },
        layoutManager: { type: ELayoutManagerType.CentralAxes }
    },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // To allow easier visualisation of axis position
        backgroundColor: "#50C7E022",
        axisBorder: {
          borderTop: 1,
          color: "#50C7E0"
        }
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // To allow easier visualisation of axis position
        backgroundColor: "#F4842022",
        axisBorder: {
          borderRight: 1,
          color: "#F48420"
        }
      }
    },
  });
  // #endregion
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");
