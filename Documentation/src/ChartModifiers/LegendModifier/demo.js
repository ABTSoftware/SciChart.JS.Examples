import * as SciChart from "scichart";

async function legend(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        LegendModifier,
        ELegendPlacement,
        ELegendOrientation,
        AUTO_COLOR
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 4; i++) {
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                stroke: AUTO_COLOR,
                strokeThickness: 2,
                dataSeries: new XyDataSeries(wasmContext, {
                    dataSeriesName: `Series ${i + 1}`,
                    xValues,
                    yValues: xValues.map(x => x + i)
                })
            })
        );
    }

    // #region ExampleA
    // Add Standard Legend
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showCheckboxes: true,
            showSeriesMarkers: true
        })
    );
    // #endregion
}

legend("scichart-root");
