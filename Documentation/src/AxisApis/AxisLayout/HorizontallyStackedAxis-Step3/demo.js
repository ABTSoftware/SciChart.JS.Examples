import * as SciChart from "scichart";

async function horizontallyStackedAxis(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        TopAlignedOuterHorizontallyStackedAxisLayoutStrategy,
        FastLineRenderableSeries,
        XyDataSeries
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // #region ExampleA
    sciChartSurface.layoutManager.topOuterAxesLayoutStrategy =
        new TopAlignedOuterHorizontallyStackedAxisLayoutStrategy();

    // Create an XAxis on the left
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Rotated X Axis",
            axisTitleStyle: { fontSize: 13 },
            backgroundColor: "#50C7E022",
            axisBorder: { color: "#50C7E0", borderRight: 1 },
            axisAlignment: EAxisAlignment.Left
        })
    );

    // Create several Y-Axis on the Top
    const axisAlignment = EAxisAlignment.Top;
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis0", axisTitle: "Rotated, Stacked Y Axis 0", axisAlignment })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis1", axisTitle: "Rotated, Stacked Y Axis 1", axisAlignment })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis2", axisTitle: "Rotated, Stacked Y Axis 2", axisAlignment })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis3", axisTitle: "Rotated, Stacked Y Axis 3", axisAlignment })
    );
    // #endregion

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420"];
    sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
        yAxis.backgroundColor = axisColors[index] + "22";
        yAxis.axisBorder = { color: axisColors[index], borderBottom: 1 };
        yAxis.axisTitleStyle.fontSize = 13;
    });

    // Let's add some series to the chart to show how they also behave with axis
    const getOptions = index => {
        const xValues = Array.from(Array(50).keys());
        const yValues = xValues.map(x => Math.sin(x * 0.4 + index));

        return {
            yAxisId: `YAxis${index}`,
            stroke: axisColors[index],
            strokeThickness: 2,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
        };
    };

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(0) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(1) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(2) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(3) }));
}

horizontallyStackedAxis("scichart-root");
