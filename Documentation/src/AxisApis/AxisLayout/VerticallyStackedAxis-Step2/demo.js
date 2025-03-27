async function verticallyStackedAxis(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        SciChartJsNavyTheme,
        EAxisAlignment,
        LeftAlignedOuterVerticallyStackedAxisLayoutStrategy,
        FastLineRenderableSeries,
        XyDataSeries,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    // #region ExampleA
    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy =
        new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
    // #endregion

    // Create an XAxis on the bottom
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            axisTitleStyle: { fontSize: 13 },
            backgroundColor: "#50C7E022",
            axisBorder: { color: "#50C7E0", borderTop: 1 },
        })
    );

    // Create several YAxis on the left
    // Creating a NumericAxis as a YAxis on the left
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis0", axisTitle: "Y Axis 0", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis1", axisTitle: "Y Axis 1", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis2", axisTitle: "Y Axis 2", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis3", axisTitle: "Y Axis 3", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis4", axisTitle: "Y Axis 4", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis5", axisTitle: "Y Axis 5", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis6", axisTitle: "Y Axis 6", axisAlignment: EAxisAlignment.Left })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { id: "YAxis7", axisTitle: "Y Axis 7", axisAlignment: EAxisAlignment.Left })
    );

    // To make it clearer what's happening, colour the axis backgrounds & borders
    const axisColors = ["#50C7E0", "#EC0F6C", "#30BC9A", "#F48420", "#364BA0", "#882B91", "#67BDAF", "#C52E60"];
    sciChartSurface.yAxes.asArray().forEach((yAxis, index) => {
        yAxis.backgroundColor = axisColors[index] + "22";
        yAxis.axisBorder = { color: axisColors[index], borderRight: 1 };
        yAxis.axisTitleStyle.fontSize = 13;
    });

    // Let's add some series to the chart to show how they also behave with axis
    const getOptions = (index) => {
        const xValues = Array.from(Array(50).keys());
        const yValues = xValues.map((x) => Math.sin(x * 0.4 + index));

        return {
            yAxisId: `YAxis${index}`,
            stroke: axisColors[index],
            strokeThickness: 2,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        };
    };

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(0) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(1) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(2) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(3) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(4) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(5) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(6) }));
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { ...getOptions(7) }));
}

verticallyStackedAxis("scichart-root");
