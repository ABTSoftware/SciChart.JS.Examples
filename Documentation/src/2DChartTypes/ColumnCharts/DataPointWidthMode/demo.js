async function simpleColumnChart(divElementId) {
    // Demonstrates how to create a Column chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EDataPointWidthMode,
        RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
        NumberRange,
        EXyDirection,
        MouseWheelZoomModifier,
        ZoomExtentsModifier,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Column Chart with DataPointWidthModes",
        titleStyle: { fontSize: 20, color: "white" },
    });

    const options = {
        axisTitleStyle: { fontSize: 16, color: "white" },
        growBy: new NumberRange(0, 0.1),
    };
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Absolute (8px)",
            id: "Absolute",
            ...options,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Range (8units)",
            id: "Range",
            ...options,
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Relative (80%)",
            id: "Relative",
            ...options,
        })
    );

    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A"];
    sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
        yAxis.backgroundColor = axisColors[index] + "22";
        yAxis.axisBorder = { color: axisColors[index], borderLeft: 1 };
    });

    // #region ExampleA
    // Create some data with gaps
    const xValues = [0, 10, 30, 70, 80, 90, 110, 120, 150, 180, 190];
    const yValues = [0.2, 0.4, 0.8, 1.5, 2.4, 8.1, 13.7, 6.4, 3.5, 1.4, 0.4];

    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
    // #endregion

    // #region ExampleB
    // Create and add three column series to demonstrate the different EDataPointWidthModes
    const columnSeries0 = new FastColumnRenderableSeries(wasmContext, {
        fill: "#50C7E077",
        stroke: "#50C7E0",
        strokeThickness: 2,
        yAxisId: "Absolute",
        dataPointWidthMode: EDataPointWidthMode.Absolute,
        // When dataPointWidthMode=Absolute, this is the width of each column in pixels
        dataPointWidth: 8,
        dataSeries,
    });
    const columnSeries1 = new FastColumnRenderableSeries(wasmContext, {
        fill: "#EC0F6C77",
        stroke: "#EC0F6C",
        strokeThickness: 2,
        yAxisId: "Range",
        dataPointWidthMode: EDataPointWidthMode.Range,
        // When dataPointWidthMode=Range, this is the width of each column in range units
        dataPointWidth: 8,
        dataSeries,
    });
    const columnSeries2 = new FastColumnRenderableSeries(wasmContext, {
        fill: "#30BC9A77",
        stroke: "#30BC9A",
        strokeThickness: 2,
        yAxisId: "Relative",
        dataPointWidthMode: EDataPointWidthMode.Relative,
        // When dataPointWidthMode=Range, this is the width of each column in relative units of available space
        dataPointWidth: 0.8,
        dataSeries,
    });
    sciChartSurface.renderableSeries.add(columnSeries0);
    sciChartSurface.renderableSeries.add(columnSeries1);
    sciChartSurface.renderableSeries.add(columnSeries2);
    // #endregion

    // Add some interactivity
    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier()
    );
}

simpleColumnChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a Column chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EDataPointWidthMode } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Create some data with gaps
    const xValues = [0, 10, 30, 70, 80, 90, 110, 120, 150, 180, 190];
    const yValues = [0.2, 0.4, 0.8, 1.5, 2.4, 8.1, 13.7, 6.4, 3.5, 1.4, 0.4];

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ColumnSeries,
                xyData: {
                    xValues,
                    yValues,
                },
                options: {
                    fill: "rgba(176, 196, 222, 0.5)",
                    stroke: "rgba(176, 196, 222, 1)",
                    strokeThickness: 2,
                    // Use this with sparse data
                    dataPointWidthMode: EDataPointWidthMode.Range,
                    // This is now "x range per column"
                    dataPointWidth: 8,
                },
            },
        ],
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
