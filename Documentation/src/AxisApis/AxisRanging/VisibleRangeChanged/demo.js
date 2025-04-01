import * as SciChart from "scichart";

async function visibleRangeChanged(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        TextAnnotation,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const options = {
        x1: 0.5,
        y1: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        opacity: 0.77,
        fontSize: 28,
        fontWeight: "Bold",
        textColor: "White"
    };

    // #region ExampleA
    // Create a chart with X,Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add a label showing the status
    const textAnnotation = new TextAnnotation({
        text: "Drag to pan the chart",
        ...options
    });
    sciChartSurface.annotations.add(textAnnotation);

    // subscribe to visibleRangeChanged on yAxis
    sciChartSurface.yAxes.get(0).visibleRangeChanged.subscribe(args => {
        const message = `yAxis range: ${args.visibleRange.min.toFixed(2)}, ${args.visibleRange.max.toFixed(2)}`;
        console.log(message);
        textAnnotation.text = message;
    });
    // #endregion

    // add pan and zoom behaviour
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

visibleRangeChanged("scichart-root");

async function builderExample(divElementId) {
    const {
        chartBuilder,
        ESeriesType,
        EThemeProviderType,
        EAxisType,
        EAnnotationType,
        EChart2DModifierType,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint
    } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const yValues = xValues.map(x => Math.sin(x * 0.2));

    // #region ExampleB
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "X Axis"
            }
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Y Axis"
            }
        },
        modifiers: [{ type: EChart2DModifierType.ZoomPan }],
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Drag to pan the chart",
                    x1: 0.5,
                    y1: 0.5,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Top,
                    opacity: 0.77,
                    fontSize: 28,
                    fontWeight: "Bold",
                    textColor: "White"
                }
            }
        ]
    });

    const yAxis = sciChartSurface.yAxes.get(0);
    const textAnnotation = /** @type {import("scichart").TextAnnotation} */ (sciChartSurface.annotations.get(0));

    yAxis.visibleRangeChanged.subscribe(args => {
        const message = `yAxis range: ${args.visibleRange.min.toFixed(2)}, ${args.visibleRange.max.toFixed(2)}`;
        console.log(message);
        textAnnotation.text = message;
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
