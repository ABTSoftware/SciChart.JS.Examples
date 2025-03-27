async function chartWithDateTimeNumericAxis(divElementId) {
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
        FastLineRenderableSeries,
        XyDataSeries,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // #region ExampleA
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
    const minDate = new Date("2023-03-01");
    const maxDate = new Date("2023-03-10");

    // Create the axis. SmartDateLabelProvider is automatically applied to labelProvider property
    const xAxis = new DateTimeNumericAxis(wasmContext, {
        axisTitle: "X Axis / DateTime",
        // We need to specify some visibleRange to see these two dates
        // SciChart.js expects linux timestamp / 1000
        visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
    });

    // Add the xAxis to the chart
    sciChartSurface.xAxes.add(xAxis);

    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Y Axis, Numeric",
            axisAlignment: EAxisAlignment.Left,
        })
    );

    // Add a series to the chart with X-data as dates using unix Timestamp / 1000
    //
    const xValues = [];
    const yValues = [];
    let startDate = minDate.getTime() / 1000;
    for (let i = 0; i <= 10; i++) {
        xValues.push(startDate);
        yValues.push(Math.random() * 0.1 + (i > 0 ? yValues[i - 1] : 0));
        startDate += 86400; // number of seconds in a day
    }
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            strokeThickness: 3,
            stroke: "#50C7E0",
        })
    );
    // Note console log out xValues to see they are unix timestamps / 1000
    console.log("xValues: " + xValues);
    // #endregion

    // For the example, we add zooming, panning and an annotation so you can see how dates react on zoom.
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "DateTimeNumericAxis Demo",
            x1: 0.5,
            y1: 0.5,
            yCoordShift: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            opacity: 0.33,
            fontSize: 36,
            fontWeight: "Bold",
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
            fontSize: 17,
        })
    );
}

chartWithDateTimeNumericAxis("scichart-root");

async function builderExample(divElementId) {
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, EThemeProviderType, NumberRange, EAxisAlignment, EAxisType, ESeriesType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // #region ExampleB
    // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
    const minDate = new Date("2023-03-01");
    const maxDate = new Date("2023-03-10");

    // Create data for the chart with X-data as dates using unix Timestamp / 1000
    const xValues = [];
    const yValues = [];
    let startDate = minDate.getTime() / 1000;
    for (let i = 0; i <= 10; i++) {
        xValues.push(startDate);
        yValues.push(Math.random() * 0.1 + (i > 0 ? yValues[i - 1] : 0));
        startDate += 86400; // number of seconds in a day
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        xAxes: {
            type: EAxisType.DateTimeNumericAxis,
            options: {
                axisTitle: "X Axis / DateTime",
                // We need to specify some visibleRange to see these two dates
                // SciChart.js expects linux timestamp / 1000
                visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisTitle: "Y Axis, Left, default formatting",
                axisAlignment: EAxisAlignment.Left,
            },
        },
        series: [
            {
                type: ESeriesType.LineSeries,
                options: {
                    strokeThickness: 3,
                    stroke: "#50C7E0",
                },
                xyData: { xValues, yValues },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
