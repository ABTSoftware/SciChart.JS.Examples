import { BaseHitTestProvider, HitTestInfo, hitTestHelpers, Point, SplineLineRenderableSeries } from "scichart";

/**
 * A {@link BaseHitTestProvider} that hit-tests against the interpolated spline points instead of the raw
 * data-series points.
 *
 * The stock {@link LineSeriesHitTestProvider} measures the pointer distance to the straight chords between the
 * raw data points. For a {@link SplineLineRenderableSeries} the drawn curve bows away from those chords, so the
 * pointer can be right on the visible line yet miss the hit-test. The spline transform already produces a dense
 * set of interpolated points (exposed as {@link SplineLineRenderableSeries.xSplineValues} / {@link
 * SplineLineRenderableSeries.ySplineValues} after the first render); testing the straight segments between those
 * dense points follows the visible curve closely.
 */
export class SplineLineHitTestProvider extends BaseHitTestProvider<SplineLineRenderableSeries> {
    public hitTest(
        x: number,
        y: number,
        hitTestRadius: number = BaseHitTestProvider.DEFAULT_HIT_TEST_RADIUS
    ): HitTestInfo {
        const hitTestPoint = this.getTranslatedHitTestPoint(x, y);
        if (!hitTestPoint || !this.currentRenderPassData) {
            return HitTestInfo.empty();
        }

        const series = this.parentSeries;
        // The normal draw path runs the spline transform into a local variable and discards it, so
        // series.transformedRenderPassData (backing xSplineValues/ySplineValues) is only ever populated as a
        // side effect of Y-axis auto-ranging - and goes stale on zoom/pan. Recompute it here so we always
        // hit-test against the spline points that are currently on screen.
        series.updateSplineValues();
        let xSpline: SplineLineRenderableSeries["xSplineValues"];
        let ySpline: SplineLineRenderableSeries["ySplineValues"];
        try {
            xSpline = series.xSplineValues;
            ySpline = series.ySplineValues;
        } catch {
            return HitTestInfo.empty();
        }
        const pointCount = xSpline.size();
        if (pointCount < 2) {
            return HitTestInfo.empty();
        }

        const { xCoordinateCalculator, yCoordinateCalculator, isVerticalChart } = this.currentRenderPassData;
        const xHitCoord = isVerticalChart ? hitTestPoint.y : hitTestPoint.x;
        const yHitCoord = isVerticalChart ? hitTestPoint.x : hitTestPoint.y;

        const getX = (i: number) => xSpline.get(i);
        const getY = (i: number) => ySpline.get(i);
        const { isHit, nearestPointIndex } = hitTestHelpers.getNearestLineSegment(
            xCoordinateCalculator,
            yCoordinateCalculator,
            pointCount - 1,
            getX,
            getY,
            (i: number) => xSpline.get(i + 1),
            (i: number) => ySpline.get(i + 1),
            xHitCoord,
            yHitCoord,
            hitTestRadius
        );

        const hitTestInfo = new HitTestInfo(series);
        hitTestInfo.hitTestPoint = new Point(xHitCoord, yHitCoord);
        hitTestInfo.hitTestRadius = hitTestRadius;
        hitTestInfo.isHit = isHit;
        if (nearestPointIndex >= 0) {
            // Anchor xCoord/yCoord to the nearest spline vertex so getEuclideanDistance() (used by
            // SeriesSelectionModifier to pick the closest of several hit series) is meaningful.
            hitTestInfo.xCoord = xCoordinateCalculator.getCoordinate(getX(nearestPointIndex));
            hitTestInfo.yCoord = yCoordinateCalculator.getCoordinate(getY(nearestPointIndex));
            // Map the interpolated vertex back to its source data-point index, using the same convention the
            // spline transform uses for paletting (SplineRenderDataTransform.populateSourceIndexes):
            // vertex k belongs to source point floor(k / (interpolationPoints + 1)). This lets callers that
            // key off the data-point index (e.g. single-series record selection) resolve the record.
            hitTestInfo.dataSeriesIndex = Math.floor(nearestPointIndex / (series.interpolationPoints + 1));
        }
        return hitTestInfo;
    }
}
