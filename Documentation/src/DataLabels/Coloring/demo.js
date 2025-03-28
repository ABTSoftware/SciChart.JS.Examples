import * as SciChart from "scichart";

async function dataLabelColoring(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastColumnRenderableSeries,
        XyDataSeries,
        NumberRange,
        EColumnDataLabelPosition,
        parseColorToUIntArgb,
        Thickness,
        SciChartJsNavyTheme
    } = SciChart;

    // or for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // #region ExampleA
    // Create a column series and add dataLabels
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        fill: "LightSteelBlue",
        strokeThickness: 1,
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [-3, -4, 0, 2, 6.3, 3, 4, 8, 7, 5, 6, 8]
        }),
        dataLabels: {
            positionMode: EColumnDataLabelPosition.Outside,
            style: {
                fontFamily: "Default",
                fontSize: 18,
                padding: new Thickness(3, 0, 3, 0)
            },
            color: "#EEE"
        }
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    // Override the colouring using dataLabelProvider.getColor
    // import { parseColorToUIntArgb } from "scichart";
    const red = parseColorToUIntArgb("red");
    const yellow = parseColorToUIntArgb("yellow");
    const green = parseColorToUIntArgb("green");
    columnSeries.dataLabelProvider.getColor = (dataLabelState, text) => {
        const y = dataLabelState.yVal();
        if (y <= 0) return red;
        if (y <= 5) return yellow;
        return green;
    };
    // #endregion ExampleA
}

dataLabelColoring("scichart-root");
