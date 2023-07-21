import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import classes from "../../../styles/Examples.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { BandAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/BandAnimation";
import { makeStyles } from "@material-ui/core/styles";
import { appTheme } from "scichart-example-dependencies";

const divElementId = "chart";

// Colours used for style 1
const lineColor1 = appTheme.VividOrange;
const fillColor1 = appTheme.VividOrange + "33";
const lineColor2 = appTheme.VividSkyBlue;
const fillColor2 = appTheme.VividSkyBlue + "33";

// Colurs used for style 2
const lineColor1b = appTheme.VividPink;
const fillColor1b = appTheme.VividPink + "33";
const lineColor2b = appTheme.PaleTeal;
const fillColor2b = appTheme.PaleTeal + "33";

const POINTS = 100;
const STEP = (3 * Math.PI) / POINTS;

const drawExample = async () => {
    // create a chart with X, Y axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));

    // Generate some data
    let xValues: number[] = [];
    let yValues: number[] = [];
    let y1Values: number[] = [];
    for (let x = 0; x <= POINTS; x++) {
        const k = 1 - x / 2000;
        const y = Math.sin(x * STEP) * k * 0.7 + 1;
        const y1 = Math.cos(x * STEP) * k + 1;
        xValues.push(x);
        yValues.push(y);
        y1Values.push(y1);
    }
    // Create a band series with the data and initial stroke/fill colours
    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
        strokeThickness: 4,
        stroke: lineColor1,
        strokeY1: lineColor2,
        fill: fillColor1,
        fillY1: fillColor2
    });
    sciChartSurface.renderableSeries.add(bandSeries);

    // Animate both the data & the style of the chart, using a style animation
    const animateChartStyle = (isStyle1: boolean) => {
        xValues = [];
        yValues = [];
        y1Values = [];

        // Depending on the flag passed in, change the data. Just for eye candy
        if (isStyle1) {
            for (let x = 0; x <= POINTS; x++) {
                const k = 1 - x / 2000;
                const y = Math.sin(x * STEP) * k * 0.7 + 1;
                const y1 = Math.cos(x * STEP) * k + 1;
                xValues.push(x);
                yValues.push(y);
                y1Values.push(y1);
            }
        } else {
            for (let x = 0; x <= POINTS; x++) {
                const k = 1 - x / 2000;
                const y = Math.cos(x * STEP) * k * 0.7 + 1;
                const y1 = Math.sin(x * STEP) * k + 1;
                xValues.push(x);
                yValues.push(y);
                y1Values.push(y1);
            }
        }

        // Running an animation on the series lets you change data as well as styles
        bandSeries.runAnimation(
            new BandAnimation({
                duration: 1000,
                styles: {
                    strokeThickness: isStyle1 ? 4 : 8,
                    stroke: isStyle1 ? lineColor1 : lineColor1b,
                    strokeY1: isStyle1 ? lineColor2 : lineColor2b,
                    fill: isStyle1 ? fillColor1 : fillColor1b,
                    fillY1: isStyle1 ? fillColor2 : fillColor2b
                },
                dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values })
            })
        );
    };
    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    setTimeout(() => animateChartStyle(false), 1000);
    setTimeout(() => animateChartStyle(true), 3000);

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, controls: { animateChartStyle } };
};

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StyleAnimation() {
    const [preset, setPreset] = React.useState<number>(0);
    const [rs, setRs] = React.useState<IRenderableSeries>();
    const [controls, setControls] = React.useState({ animateChartStyle: (state: boolean) => {} });

    React.useEffect(() => {
        let sciChartSurface: SciChartSurface;
        (async () => {
            const res = await drawExample();
            setControls(res.controls);
            sciChartSurface = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleToggleButtonChanged = (event: any, value: number) => {
        if (value === null) return;
        setPreset(value);
        const isStyle1 = value === 0;
        controls.animateChartStyle(isStyle1);
    };

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <ToggleButtonGroup
                        exclusive
                        value={preset}
                        onChange={handleToggleButtonChanged}
                        size="medium"
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                            Animate Styles 1
                        </ToggleButton>
                        <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                            Animate Styles 2
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className={localClasses.chartArea} id={divElementId}></div>
            </div>
        </div>
    );
}
