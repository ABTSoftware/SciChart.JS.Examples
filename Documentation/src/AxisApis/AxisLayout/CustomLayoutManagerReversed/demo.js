import * as SciChart from "scichart";

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
    measureAxes(sciChartSurface, chartLayoutState, axes) {
        const [firstAxis, ...stackedAxes] = axes;
        // measure stacked axes and max height (stackedAreaSize) required by them
        super.measureAxes(sciChartSurface, chartLayoutState, stackedAxes);
        const stackedAreaSize = chartLayoutState.bottomOuterAreaSize;

        // measure first axis with the regular logic
        this.defaultBottomOuterAxisLayoutStrategy.measureAxes(sciChartSurface, chartLayoutState, [firstAxis]);

        // calculate height required by the first axis and then the total height
        const firstAxisSize = getHorizontalAxisRequiredSize(firstAxis.axisLayoutState);
        return firstAxisSize + stackedAreaSize;
    }

    // #region ExampleA
    // Use the base horizontal stacked layout first, before default layout to switch the order of axis
    layoutAxes(left, top, right, bottom, axes) {
        const [firstAxis, ...stackedAxes] = axes;
        // layout stacked axes first
        super.layoutAxes(left, top, right, bottom, stackedAxes);

        // then get the top offset for the normalAxis with stackedAxis.viewRect.bottom
        const stackedAxis = stackedAxes[0];
        this.defaultBottomOuterAxisLayoutStrategy.layoutAxes(
            left,
            stackedAxis.viewRect.bottom,
            right,
            bottom,
            [firstAxis] // normal axis
        );
    }
    // #endregion
}

async function customLayoutManager(divElementId) {
    // Demonstrates how to apply a custom layout manager in SciChart.js
    const { SciChartSurface, NumericAxis, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Apply your layout manager
    sciChartSurface.layoutManager.bottomOuterAxesLayoutStrategy = new CustomAxisLayoutStrategy();

    // Create some X Axis
    const ID_X_AXIS_1 = "xAxis0";
    const ID_X_AXIS_2 = "xAxis1";
    const ID_X_AXIS_3 = "xAxis2";
    const ID_X_AXIS_4 = "xAxis3";
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
        axisTitle: "yAxis",
        backgroundColor: "#50C7E022",
        axisBorder: { color: "#50C7E0", borderLeft: 1 },
        axisTitleStyle: { fontSize: 13 }
    });

    // Add the axis to the chart
    sciChartSurface.xAxes.add(xAxis1, xAxis2, xAxis3, xAxis4);
    sciChartSurface.yAxes.add(yAxis1);

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420"];
    sciChartSurface.xAxes.asArray().forEach((xAxis, index) => {
        xAxis.backgroundColor = axisColors[index] + "22";
        xAxis.axisBorder = { color: axisColors[index], borderTop: 1 };
        xAxis.axisTitleStyle.fontSize = 13;
    });

    const { TextAnnotation, EHorizontalAnchorPoint, ECoordinateMode, EAnnotationLayer } = SciChart;
    const textOpts = {
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 0.5,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        opacity: 0.33,
        textColor: "White"
    };
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Custom Layout Manager Example",
            fontSize: 36,
            yCoordShift: -50,
            ...textOpts
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Reversing the order of Stacked and Stretched X-Axis",
            fontSize: 20,
            ...textOpts
        })
    );
}

customLayoutManager("scichart-root");
