export const code = `import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { SciChartSurface } from "scichart";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { closeValues, dateValues, highValues, lowValues, openValues } from "./data/themeing2dData";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { TSciChart } from "scichart/types/TSciChart";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.applyTheme(new SciChartJSDarkTheme());
    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 31);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(1, 1.2);
    yAxis.labelProvider.formatLabel = (dataValue: number) => dataValue.toFixed(3);
    sciChartSurface.yAxes.add(yAxis);

    const series1 = new FastLineRenderableSeries(wasmContext);
    series1.strokeThickness = 3;
    sciChartSurface.renderableSeries.add(series1);

    series1.dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 15, 30],
        yValues: [1.12, 1.11, 1.1]
    });

    const series2 = new FastCandlestickRenderableSeries(wasmContext, {
        strokeThickness: 2,
        dataSeries: new OhlcDataSeries(wasmContext, {
            xValues: dateValues,
            openValues,
            highValues,
            lowValues,
            closeValues
        }),
        dataPointWidth: 0.5
    });
    sciChartSurface.renderableSeries.add(series2);

    const series3 = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.7)",
        stroke: "#4682b4",
        strokeThickness: 2,
        dataPointWidth: 0.5
    });
    sciChartSurface.renderableSeries.add(series3);
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 1; i <= 30; i++) {
        dataSeries.append(i, 1 + Math.sin(i * 0.1) * 0.1);
    }
    series3.dataSeries = dataSeries;

    sciChartSurface.chartModifiers.add(new RolloverModifier());
    return { sciChartSurface, wasmContext };
};

enum ETheme {
    SciChartDark,
    SciChartLight
}

const themeSelect = [
    { value: ETheme.SciChartDark, text: "SciChartDark" },
    { value: ETheme.SciChartLight, text: "SciChartLight" }
];

export default function UsingThemeManager() {
    const [themeToDisplay, setThemeToDisplay] = React.useState<ETheme>(ETheme.SciChartDark);
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    const [showChart, setShowChart] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setWasmContext(res.wasmContext);
            setShowChart(true);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleChangeTheme = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = +event.target.value as ETheme;
        setThemeToDisplay(newValue);
        switch (newValue) {
            case ETheme.SciChartDark:
                sciChartSurface.applyTheme(new SciChartJSDarkTheme());
                break;
            case ETheme.SciChartLight:
                sciChartSurface.applyTheme(new SciChartJSLightTheme());
        }
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div className={classes.SelectWrapper}>
                <div className={classes.InputSelectWrapper}>
                    <label id="sciChartTheme-label">
                        Select Theme
                        <select
                            id="sciChartTheme"
                            value={themeToDisplay}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                if (showChart) handleChangeTheme(e);
                            }}
                        >
                            {themeSelect.map(el => (
                                <option key={el.value} value={el.value}>
                                    {el.text}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}
`;