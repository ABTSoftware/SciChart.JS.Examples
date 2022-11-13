import * as React from "react";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { Point } from "scichart/Core/Point";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import classes from "../../../../Examples/Examples.module.scss";
import Box from "../../../../../helpers/shared/Helpers/Box/Box";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { translateFromCanvasToSeriesViewRect } from "scichart/utils/translate";
import {FadeAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/FadeAnimation";
import {easing} from "scichart/Core/Animations/EasingFunctions";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {LineAnnotation} from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import {DoubleAnimator} from "scichart/Core/Animations/DoubleAnimator";
import {GenericAnimation} from "scichart/Core/Animations/GenericAnimation";
import {appTheme} from "../../../theme";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface with theme
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
            theme: appTheme.SciChartJsTheme
    });
    // Create an X,Y Axis. For this example we put y-axis on the left to demonstrate offsetting the mouse-point when hit-testing
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1)
    }));

    // Create a Line Series with XyDataSeries and some data
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: "Line Series",
            xValues: [0,1,2,3,4,5,6,7,8,9],
            yValues: [0,1,5,1,20,5,1,8,9,3],
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            fill: appTheme.VividSkyBlue + "33",
            width: 11,
            height: 11,
        }),
    });

    // Add the line series to the SciChartSurface
    sciChartSurface.renderableSeries.add(lineSeries);

    // add an event listener for mouse down. You can access the actual SciChartSurface canvas as
    // follows, or find element by ID=divElementId in the dom
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {

        // Translate the point to the series viewrect before hit-testing
        // Attention!
        // We need to multiply it by DpiHelper.PIXEL_RATIO
        // DpiHelper.PIXEL_RATIO is used for High DPI and Retina screen support and also for the browser scaling
        const mousePointX = mouseEvent.offsetX * DpiHelper.PIXEL_RATIO;
        const mousePointY = mouseEvent.offsetY * DpiHelper.PIXEL_RATIO;
        // const translatedPoint = translateFromCanvasToSeriesViewRect(mousePoint, sciChartSurface.seriesViewRect);
        const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;

        // call renderableSeries.hitTestProvider.hitTest passing in the mouse point
        // other parameters determine the type of hit-test operation to perform
        // here we use IHitTestProvider.hitTestDataPoint method which finds the nearest point on the 2D surface
        const hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(
            mousePointX,
            mousePointY,
            HIT_TEST_RADIUS
        );

        // Log the result to console. HitTestInfo contains information about the hit-test operation
        console.log(`${hitTestInfo.dataSeriesName} hit test result:\r\n` +
            ` MouseCoord=(${mousePointX}, ${mousePointY})\r\n` +
            // ` TranslatedCoord=(${translatedPoint.x}, ${translatedPoint.y})\r\n` +
            ` Hit-Test Coord=(${hitTestInfo.xCoord}, ${hitTestInfo.yCoord})\r\n` +
            ` IsHit? ${hitTestInfo.isHit}\r\n` +
            ` Result=(${hitTestInfo.xValue}, ${hitTestInfo.yValue}) `
        );
        showHitTestPoint(sciChartSurface, hitTestInfo, 1000);
    });

    return { sciChartSurface, wasmContext };
}

// Helper function to show where the user clicked on the chart
function showHitTestPoint(sciChartSurface: SciChartSurface, hitTestInfo: HitTestInfo, timeout: number) {
    sciChartSurface.annotations.clear();

    // Use a scatter series to temporarily render a single point at the hitTestInfo.x/yValue
    const fill = hitTestInfo.isHit ? appTheme.VividGreen : appTheme.VividRed;
    const series = new XyScatterRenderableSeries(sciChartSurface.webAssemblyContext2D, {
        animation: new FadeAnimation({ duration: timeout, ease: (t) => 1-t }),
        opacity: 1,
        dataSeries: new XyDataSeries(sciChartSurface.webAssemblyContext2D, { xValues: [hitTestInfo.xValue], yValues: [hitTestInfo.yValue] }),
        pointMarker: new EllipsePointMarker(sciChartSurface.webAssemblyContext2D, { width: 25, height: 25, strokeThickness: 0, fill})
    });
    sciChartSurface.renderableSeries.add(series);
    const hitOrMissLabel = new TextAnnotation({
        x1: hitTestInfo.xValue + 0.1,
        y1: hitTestInfo.yValue,
        fontSize: 20,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        text: hitTestInfo.isHit ? "Hit!" : "miss...",
        textColor: appTheme.ForegroundColor
    });
    sciChartSurface.annotations.add(hitOrMissLabel);

    const hitTestLine = new LineAnnotation( {
        x1: hitTestInfo.xValue,
        y1: hitTestInfo.yValue,
        x2: hitTestInfo.hitTestPointValues.x,
        y2: hitTestInfo.hitTestPointValues.y,
        strokeThickness: 2,
        stroke: fill,
    });
    sciChartSurface.annotations.add(hitTestLine);

    sciChartSurface.addAnimation(new GenericAnimation({
        from: 1,
        to: 0,
        // Progress animates from 0..1. We want to reverse the opacity so we use 1-progress
        onAnimate: (from, to, progress: number) => {
            hitTestLine.opacity = 1 - progress;
            hitOrMissLabel.opacity = 1 - progress;
        },
        onCompleted: () => {
            sciChartSurface.renderableSeries.remove(series);
            sciChartSurface.annotations.remove(hitOrMissLabel);
            sciChartSurface.annotations.remove(hitTestLine);
            series.delete();
            hitOrMissLabel.delete();
            hitTestLine.delete();
        }, ease: easing.linear
    }));
}

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
        width: "100%"
    },
    chartArea: {
        flex: 1,
    }
}));

export default function HitTestAPI() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
                    exclusive
                    // value={preset}
                    // onChange={handlePreset}
                    size="small" color="primary" aria-label="small outlined button group">
                    <ToggleButton value={0} style={{color: appTheme.ForegroundColor}}>
                        Hit-Test Datapoint
                    </ToggleButton>
                    <ToggleButton value={1} style={{color: appTheme.ForegroundColor}}>
                        Hit-Test X-Slice
                    </ToggleButton>
                    <ToggleButton value={2} style={{color: appTheme.ForegroundColor}}>
                        Hit-Test 2-Dimensions
                    </ToggleButton>
                </ToggleButtonGroup>
                <div id={divElementId} className={localClasses.chartArea} />
            </div>
        </div>

    );
}
