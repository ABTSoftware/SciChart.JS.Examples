import * as SciChart from "scichart";

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
        CursorModifier,
        TextAnnotation,
        ECoordinateMode,
        EHorizontalAnchorPoint,
        EVerticalAnchorPoint,
        ENumericFormat
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Unix Epoch for March 1st 2023 & March 2nd 2023
    const march1st2023 = new Date("2023-03-1").getTime(); // = 1677628800000 ms since 1/1/1970
    const march2nd2023 = new Date("2023-03-2").getTime(); // = 1677715200000 ms since 1/1/1970
    const oneDay = march2nd2023 - march1st2023; // = 86400000 milliseconds in one day

    // Creating a CategoryAxis as an XAxis on the bottom
    sciChartSurface.xAxes.add(
        new CategoryAxis(wasmContext, {
            // set Defaults so that category axis can draw. Once you add series and data these will be overridden
            // All Linux Timestamp properties in scichart.js must be divided by 1,000 to go from milliseconds to seconds
            defaultXStart: march1st2023 / 1000,
            defaultXStep: oneDay / 1000,
            // set other properties
            drawMajorGridLines: true,
            drawMinorGridLines: true,
            axisTitle: "Category X Axis",
            axisAlignment: EAxisAlignment.Bottom,
            // set a date format for labels
            labelFormat: ENumericFormat.Date_DDMMYY
        })
    );

    // Create a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Numeric Y Axis",
            axisAlignment: EAxisAlignment.Left
        })
    );
    // #endregion

    // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new CursorModifier());

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "CategoryAxis Demo",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.33,
            fontSize: 36,
            fontWeight: "Bold"
        })
    );
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Try mouse-wheel, left/right mouse drag and notice the dynamic X-Axis Labels",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 50,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.45,
            fontSize: 17
        })
    );
}

chartWithCategoryAxis("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, NumberRange, EAxisAlignment, EAxisType, ENumericFormat } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    // Unix Epoch for March 1st 2023 & March 2nd 2023
    const march1st2023 = new Date("2023-03-1").getTime(); // = 1677628800000 ms since 1/1/1970
    const march2nd2023 = new Date("2023-03-2").getTime(); // = 1677715200000 ms since 1/1/1970
    const oneDay = march2nd2023 - march1st2023; // = 86400000 milliseconds in one day

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.CategoryAxis,
            options: {
                // set Defaults so that category axis can draw. Once you add series and data these will be overridden
                // All Linux Timestamp properties in scichart.js must be divided by 1,000 to go from milliseconds to seconds
                defaultXStart: march1st2023 / 1000,
                defaultXStep: oneDay / 1000,
                // set other properties
                drawMajorGridLines: true,
                drawMinorGridLines: true,
                axisTitle: "Category X Axis",
                axisAlignment: EAxisAlignment.Bottom,
                // set a date format for labels
                labelFormat: ENumericFormat.Date_DDMMYY
            }
        },

        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Numeric Y Axis",
                axisAlignment: EAxisAlignment.Left
            }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
