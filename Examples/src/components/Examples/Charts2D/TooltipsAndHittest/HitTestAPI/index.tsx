import * as React from "react";
import classes from "../../../../Examples/Examples.module.scss";
import { appTheme } from "../../../theme";
import { visualiseHitTestPoint } from "./visualizeHitTest";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

import {
    SciChartSurface,
    NumericAxis,
    EAxisAlignment,
    NumberRange,
    FastLineRenderableSeries,
    XyDataSeries,
    EllipsePointMarker,
    HitTestInfo,
    DpiHelper,
    TextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    EAnnotationLayer,
    EMultiLineAlignment,
    ETextAlignment,
    Thickness
} from "scichart";

const divElementId = "chart";

// This method hit-tests the series body
const HIT_TEST = "hitTest";
// This method hit-tests the nearest data-point
const HIT_TEST_DATAPOINT = "hitTestDataPoint";
// This method hit-tests by searching first in X, then Y
const HIT_TEST_X_SLICE = "hitTestXSlice";

const drawExample = async () => {
    // Which hit-test method are we using? See below for usage
    let whichHitTestMethod = HIT_TEST_DATAPOINT;

    // Create a SciChartSurface with theme
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        title: [
            "Click on the chart to demonstrate Hit-Test API",
            "Change the Hit-Test method above to see the different behaviours"
        ],
        titleStyle: {
            fontSize: 16,
            placeWithinChart: true,
            alignment: ETextAlignment.Left,
            multilineAlignment: EMultiLineAlignment.Left,
            color: appTheme.ForegroundColor + "C4",
            padding: Thickness.fromString("13 4 0 9")
        }
    });

    // add an event listener for mouse down. You can access the actual SciChartSurface canvas as
    // follows, or find element by ID=divElementId in the dom
    sciChartSurface.domCanvas2D.addEventListener("mousedown", mouseEvent => {
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
        // There are three hit-test methods which have different outcomes. We let the user choose
        let hitTestInfo: HitTestInfo;
        if (whichHitTestMethod === HIT_TEST_DATAPOINT) {
            // Hit-test the nearest data-point, searching first in X, then Y
            hitTestInfo = lineSeries.hitTestProvider.hitTestDataPoint(mousePointX, mousePointY, HIT_TEST_RADIUS);
        }
        if (whichHitTestMethod === HIT_TEST_X_SLICE) {
            // Hit-test the nearest data-point in X only (imagine a vertical slice on the chart)
            hitTestInfo = lineSeries.hitTestProvider.hitTestXSlice(mousePointX, mousePointY, HIT_TEST_RADIUS);
        }
        if (whichHitTestMethod === HIT_TEST) {
            // Hit-test in two-dimensions (slowest method but finds the nearest data-point by distance)
            hitTestInfo = lineSeries.hitTestProvider.hitTest(mousePointX, mousePointY, HIT_TEST_RADIUS);
        }

        // Log the result to console. HitTestInfo contains information about the hit-test operation
        console.log(
            `${hitTestInfo.dataSeriesName} hit test result (${whichHitTestMethod}):\r\n` +
                ` MouseCoord=(${mousePointX}, ${mousePointY})\r\n` +
                ` Hit-Test Coord=(${hitTestInfo.xCoord}, ${hitTestInfo.yCoord})\r\n` +
                ` IsHit? ${hitTestInfo.isHit}\r\n` +
                ` Result=(${hitTestInfo.xValue}, ${hitTestInfo.yValue}) `
        );
        visualiseHitTestPoint(sciChartSurface, hitTestInfo, whichHitTestMethod, 1000);
    });

    // Continue chart setup
    //

    // Create an X,Y Axis. For this example we put y-axis on the left to demonstrate offsetting the mouse-point when hit-testing
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.1, 0.1)
        })
    );

    // Create a Line Series with XyDataSeries and some data
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: "Line Series",
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            yValues: [0, 1, 5, 1, 20, 5, 1, 8, 9, 3]
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            fill: appTheme.VividSkyBlue + "33",
            width: 11,
            height: 11
        })
    });

    // Add the line series to the SciChartSurface
    sciChartSurface.renderableSeries.add(lineSeries);

    const watermarkAnnotation = (text: string = "") => {
        return new TextAnnotation({
            text,
            fontSize: 32,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0.5,
            opacity: 0.23,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart
        });
    };

    // Add a watermark
    const theWatermark = watermarkAnnotation("METHOD: " + whichHitTestMethod + "()");
    sciChartSurface.annotations.add(theWatermark);

    // Allow changing method and updating watermark.
    const updateHitTestMethod = (hitTestMethod: string) => {
        console.log("Setting hitTestMethod " + hitTestMethod);
        whichHitTestMethod = hitTestMethod;
        theWatermark.text = "METHOD: " + hitTestMethod + "()";
    };

    return { sciChartSurface, wasmContext, updateHitTestMethod };
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
        width: "100%"
    },
    chartArea: {
        flex: 1
    }
}));

export default function HitTestAPI() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [updateFunc, setUpdateHitTestMethod] = React.useState<(hitTestMethod: string) => void>(() => {});
    const [preset, setPreset] = React.useState<string>(HIT_TEST_DATAPOINT);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setUpdateHitTestMethod(() => res.updateHitTestMethod);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handlePreset = (event: any, value: string) => {
        // When user clicks a togglebutton, update state
        if (value) {
            console.log("ToggleButton changed " + value);
            setPreset(value);
            updateFunc(value);
        }
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
                    exclusive
                    value={preset}
                    onChange={handlePreset}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={HIT_TEST_DATAPOINT} style={{ color: appTheme.ForegroundColor }}>
                        Hit-Test Datapoint
                    </ToggleButton>
                    <ToggleButton value={HIT_TEST_X_SLICE} style={{ color: appTheme.ForegroundColor }}>
                        Hit-Test X-Slice
                    </ToggleButton>
                    <ToggleButton value={HIT_TEST} style={{ color: appTheme.ForegroundColor }}>
                        Hit-Test Series Body
                    </ToggleButton>
                </ToggleButtonGroup>
                <div id={divElementId} className={localClasses.chartArea} />
            </div>
        </div>
    );
}
