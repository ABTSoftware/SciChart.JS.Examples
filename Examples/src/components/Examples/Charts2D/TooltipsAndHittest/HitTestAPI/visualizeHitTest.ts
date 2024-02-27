import {
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EllipsePointMarker,
    FadeAnimation,
    GenericAnimation,
    HitTestInfo,
    LineAnnotation,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    XyScatterRenderableSeries,
    easing,
} from "scichart";
import { appTheme } from "scichart-example-dependencies";

// This method hit-tests the series body
const HIT_TEST = "hitTest";
// This method hit-tests the nearest data-point
const HIT_TEST_DATAPOINT = "hitTestDataPoint";
// This method hit-tests by searching first in X, then Y
const HIT_TEST_X_SLICE = "hitTestXSlice";

// Helper function to visualise where the user clicked on the chart
export function visualiseHitTestPoint(
    sciChartSurface: SciChartSurface,
    hitTestInfo: HitTestInfo,
    hitTestMethod: string,
    timeout: number
) {
    // HitTestInfo contains info about where the user clicked on a chart during a hitTest operation
    // This can include the x/y value hit, whether the mouse was over a point/segment
    // and info about previous points and mouse coordinates
    //
    // Below: we visualise hitTestInfo using animations, series & annotations in SciChart
    //

    // Use a scatter series to temporarily render a single point at the hitTestInfo.x/yValue
    const fill = hitTestInfo.isHit ? appTheme.PaleTeal : appTheme.VividPink;
    const series = new XyScatterRenderableSeries(sciChartSurface.webAssemblyContext2D, {
        animation: new FadeAnimation({ duration: timeout, ease: (t) => 1 - t }),
        opacity: 1,
        dataSeries: new XyDataSeries(sciChartSurface.webAssemblyContext2D, {
            xValues: [hitTestInfo.xValue],
            yValues: [hitTestInfo.yValue],
        }),
        pointMarker: new EllipsePointMarker(sciChartSurface.webAssemblyContext2D, {
            width: 25,
            height: 25,
            strokeThickness: 0,
            fill,
        }),
    });
    sciChartSurface.renderableSeries.add(series);
    const hitOrMissLabel = new TextAnnotation({
        x1: hitTestInfo.xValue + 0.1,
        y1: hitTestInfo.yValue,
        fontSize: 20,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        text: hitTestInfo.isHit ? "Hit!" : "miss...",
        textColor: appTheme.ForegroundColor,
    });
    sciChartSurface.annotations.add(hitOrMissLabel);

    const hitTestLine = new LineAnnotation({
        strokeThickness: 2,
        stroke: fill,
    });
    // Depending on the hitTestMethod, we want to position the lineAnnotation to show whats going on
    if (hitTestMethod === HIT_TEST_DATAPOINT) {
        // Draw from mouse-click point to nearest datapoint
        hitTestLine.strokeThickness = 2;
        series.isVisible = true;
        hitTestLine.x1 = hitTestInfo.xValue;
        hitTestLine.y1 = hitTestInfo.yValue;
        hitTestLine.x2 = hitTestInfo.hitTestPointValues.x;
        hitTestLine.y2 = hitTestInfo.hitTestPointValues.y;
    }
    if (hitTestMethod === HIT_TEST_X_SLICE) {
        // Draw from mouse-click point to top/bottom of the viewport
        hitTestLine.strokeThickness = 2;
        series.isVisible = true;
        hitTestLine.x1 = hitTestInfo.hitTestPointValues.x;
        hitTestLine.y1 = 0;
        hitTestLine.x2 = hitTestInfo.hitTestPointValues.x;
        hitTestLine.y2 = sciChartSurface.yAxes.get(0).visibleRange.max;
    }
    if (hitTestMethod === HIT_TEST) {
        // Draw over the line-segment selected
        hitTestLine.strokeThickness = 5;
        series.isVisible = false;
        hitTestLine.x1 = hitTestInfo.xValue; // x,y value hit
        hitTestLine.y1 = hitTestInfo.yValue;
        hitTestLine.x2 = hitTestInfo.point2xValue; // next x,y value in the line segment
        hitTestLine.y2 = hitTestInfo.point2yValue;
    }
    sciChartSurface.annotations.add(hitTestLine);

    // Animate the appearance of the annotations
    sciChartSurface.addAnimation(
        new GenericAnimation({
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
            },
            ease: easing.linear,
        })
    );
}
