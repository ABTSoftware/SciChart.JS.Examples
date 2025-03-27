async function customLegend(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendPlacement,
        ELegendOrientation,
        AUTO_COLOR,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 4; i++) {
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                stroke: AUTO_COLOR,
                dataSeries: new XyDataSeries(wasmContext, {
                    dataSeriesName: `Series ${i + 1}`,
                    xValues,
                    yValues: xValues.map((x) => x + i),
                }),
            })
        );
    }

    // #region CustomLegend
    // Create a LegendModifier
    const legendModifier = new LegendModifier({
        placement: ELegendPlacement.TopLeft,
        orientation: ELegendOrientation.Vertical,
        showCheckboxes: true,
        showSeriesMarkers: true,
    });
    // Override the itemHtml
    const { getLegendItemHtml } = SciChart;

    legendModifier.sciChartLegend.getLegendItemHTML = (orientation, showCheckboxes, showSeriesMarkers, item) => {
        // Reuse the default implementation
        let str = getLegendItemHtml(orientation, showCheckboxes, showSeriesMarkers, item);
        // Remove the closing span
        str = str.replace("</span>", "");
        const series = sciChartSurface.renderableSeries.getById(item.id);
        // Add another label
        str += `<label style="margin-left: 8px;">Last value: ${series.dataSeries
            .getNativeYValues()
            .get(series.dataSeries.count() - 1)}</label>`;
        str += `</span>`;
        return str;
    };

    // To customise the overall html, it is easier to grab a reference to the existing function and re call it.
    const getHtml = legendModifier.sciChartLegend.getLegendHTML;
    legendModifier.sciChartLegend.getLegendHTML = (
        placement,
        textColor,
        backgroundColor,
        margin,
        orientation,
        showCheckboxes,
        showSeriesMarkers,
        items
    ) => {
        let html = getHtml.call(
            legendModifier.sciChartLegend,
            placement,
            textColor,
            backgroundColor,
            margin,
            orientation,
            showCheckboxes,
            showSeriesMarkers,
            items
        );
        // Center the legend
        html = html.replace("float: left", "justify-content: center;");
        return html;
    };

    sciChartSurface.chartModifiers.add(legendModifier);
    // #endregion
}

customLegend("scichart-root");
