export const code = `import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import classes from "../../../../Examples/Examples.module.scss";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { BandAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/BandAnimation";
import { TSciChart } from "scichart/types/TSciChart";

const divElementId = "chart";

const lineColor1 = "#52CC54FF";
const fillColor1 = "#52CC5490";
const lineColor1b = "#528bcc";
const fillColor1b = "#528bcc90";
const lineColor2 = "#E26565FF";
const fillColor2 = "#E26565A0";
const lineColor2b = "#eca53c";
const fillColor2b = "#eca53cA0";

const POINTS = 100;
const STEP = (3 * Math.PI) / POINTS;

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top, labelPrecision: 0 }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Right, growBy: new NumberRange(0.4, 0.4) })
    );

    const dataSeries = new XyyDataSeries(wasmContext);
    for (let i = 0; i <= POINTS; i++) {
        const k = 1 - i / 2000;
        const y = Math.sin(i * STEP) * k * 0.7 + 1;
        const y1 = Math.cos(i * STEP) * k + 1;
        dataSeries.append(i, y, y1);
    }
    const rendSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries,
        strokeThickness: 4,
        stroke: lineColor1,
        strokeY1: lineColor2,
        fill: fillColor1,
        fillY1: fillColor2
    });
    sciChartSurface.renderableSeries.add(rendSeries);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StyleAnimation() {
    const [preset, setPreset] = React.useState<number>(0);
    const [rs, setRs] = React.useState<IRenderableSeries>();
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    React.useEffect(() => {
        let sciChartSurface: SciChartSurface;
        (async () => {
            const res = await drawExample();
            sciChartSurface = res.sciChartSurface;
            setWasmContext(res.wasmContext);
            setRs(sciChartSurface.renderableSeries.get(0));
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handlePreset = (event: any, value: number) => {
        if (value === null) return;
        setPreset(value);
        const isStyle1 = value === 0;

        const dataSeries = new XyyDataSeries(wasmContext);
        if (isStyle1) {
            for (let i = 0; i <= POINTS; i++) {
                const k = 1 - i / 2000;
                const y = Math.sin(i * STEP) * k * 0.7 + 1;
                const y1 = Math.cos(i * STEP) * k + 1;
                dataSeries.append(i, y, y1);
            }
        } else {
            for (let i = 0; i <= POINTS; i++) {
                const k = 1 - i / 2000;
                const y = Math.cos(i * STEP) * k * 0.7 + 1;
                const y1 = Math.sin(i * STEP) * k + 1;
                dataSeries.append(i, y, y1);
            }
        }

        rs.runAnimation(
            new BandAnimation({
                duration: 1000,
                styles: {
                    strokeThickness: isStyle1 ? 4 : 8,
                    stroke: isStyle1 ? lineColor1 : lineColor1b,
                    strokeY1: isStyle1 ? lineColor2 : lineColor2b,
                    fill: isStyle1 ? fillColor1 : fillColor1b,
                    fillY1: isStyle1 ? fillColor2 : fillColor2b
                },
                dataSeries
            })
        );
    };

    return (
        <>
            <div id={divElementId} className={classes.ChartWrapper} />
            <ToggleButtonGroup
                exclusive
                value={preset}
                onChange={handlePreset}
                size="medium"
                color="primary"
                aria-label="small outlined button group"
            >
                <ToggleButton value={0}>Animate Styles 1</ToggleButton>
                <ToggleButton value={1}>Animate Styles 2</ToggleButton>
            </ToggleButtonGroup>
        </>
    );
}
`;