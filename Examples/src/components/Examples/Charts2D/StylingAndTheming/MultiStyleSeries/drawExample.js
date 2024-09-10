import {
    BaseRenderDataTransform,
    NumberRange,
    XyDataSeries,
    SciChartSurface,
    NumericAxis,
    TrianglePointMarker,
    EllipsePointMarker,
    PointMarkerDrawingProvider,
    FastColumnRenderableSeries,
    GradientParams,
    Point,
    ColumnSeriesDrawingProvider,
    DataPointSelectionModifier,
    LineSeriesDrawingProvider,
    FastLineRenderableSeries,
    ELineDrawMode,
    OhlcPointSeriesResampled,
    NativeTextAnnotation,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
} from "scichart";
import { appTheme } from "../../../theme";
/**
 * This transform turns xy data into ohlc.  Unselected points are in y (close).
 * Selected points in low for pointmarkers, and selected plus points either side in high for lines.
 * If you only need this for points or columns, you could transform to Xyy instead
 */
class SplitRenderDataTransform extends BaseRenderDataTransform {
    createPointSeries() {
        return new OhlcPointSeriesResampled(this.wasmContext, new NumberRange(0, 0));
    }
    runTransformInternal(renderPassData) {
        const { xValues: oldX, yValues: oldY, indexes: oldI, resampled } = renderPassData.pointSeries;
        // this.pointSeries is the target.  Clear the existing values
        const { xValues, yValues, highValues, lowValues, indexes } = this.pointSeries;
        xValues.clear();
        yValues.clear();
        highValues.clear();
        lowValues.clear();
        indexes.clear();
        // This shows how to properly handled resampled data, though this is not necessary here.
        const iStart = resampled ? 0 : renderPassData.indexRange.min;
        const iEnd = resampled ? oldX.size() - 1 : renderPassData.indexRange?.max;
        const ds = this.parentSeries.dataSeries;
        let prevSelected = false;
        for (let i = iStart; i <= iEnd; i++) {
            const index = resampled ? oldI.get(i) : i;
            const md = ds.getMetadataAt(index);
            xValues.push_back(oldX.get(i));
            indexes.push_back(oldI.get(i));
            let nextSelected = false;
            if (i < iEnd) {
                const nextmd = ds.getMetadataAt(index + 1);
                nextSelected = nextmd.isSelected;
            }
            yValues.push_back(md.isSelected ? NaN : oldY.get(i));
            // For pointmarkers we just need the point itself
            lowValues.push_back(md.isSelected ? oldY.get(i) : NaN);
            // need points either side of the selected value for the line to draw.
            highValues.push_back(prevSelected || md.isSelected || nextSelected ? oldY.get(i) : NaN);
            prevSelected = md.isSelected;
        }
        return this.pointSeries;
    }
}
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Create X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.05) }));
    // Column series with different gradient fill for selected columns
    const xValues = Array.from({ length: 20 }, (x, i) => i);
    const colyValues = xValues.map((x) => 10 + Math.random() * 40);
    const colmetadata = xValues.map((x) => ({
        isSelected: Math.random() < 0.3,
    }));
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.MutedRed, offset: 0 },
            { color: appTheme.MutedTeal, offset: 1 },
        ]),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xValues,
            yValues: colyValues,
            metadata: colmetadata,
            containsNaN: true,
        }),
        stroke: "transparent",
    });
    // We cannot use a paletteProvider to change a gradient fill, so we have to use a second drawingProvider
    const selectedColDP = new ColumnSeriesDrawingProvider(
        wasmContext,
        columnSeries,
        // configure this to draw using the selected points
        (ps) => ps.lowValues
    );
    selectedColDP.getProperties = (parentSeries) => {
        const { stroke, strokeThickness, fill } = parentSeries;
        return {
            opacity: 1,
            // Opacity setting does not currently apply to the gradient colors, so we have to apply it individually
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.MutedRed + "88", offset: 0 },
                { color: appTheme.MutedSkyBlue + "88", offset: 1 },
            ]),
            stroke,
            strokeThickness,
            fill,
        };
    };
    columnSeries.drawingProviders.push(selectedColDP);
    columnSeries.renderDataTransform = new SplitRenderDataTransform(
        columnSeries,
        wasmContext,
        columnSeries.drawingProviders
    );
    sciChartSurface.renderableSeries.add(columnSeries);
    const lineyValues = xValues.map((x) => 30 + x + x * Math.random());
    const linemetadata = xValues.map((x) => ({
        isSelected: Math.random() < 0.3,
    }));
    // Line series with different pointmarker and dashed line for selected sections
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: xValues,
            yValues: lineyValues,
            metadata: linemetadata,
            containsNaN: true,
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 14,
            height: 14,
            strokeThickness: 0,
            fill: appTheme.VividSkyBlue,
        }),
        stroke: appTheme.VividTeal,
        strokeThickness: 3,
        drawNaNAs: ELineDrawMode.DiscontinuousLine,
    });
    const trianglePM = new TrianglePointMarker(wasmContext, {
        width: 15,
        height: 15,
        strokeThickness: 0,
        fill: appTheme.VividOrange,
    });
    // Additional line drawing for selected segments
    const selectedLineDP = new LineSeriesDrawingProvider(wasmContext, lineSeries, (ps) => ps.highValues);
    // Make this drawingProvider used dashed lines
    selectedLineDP.getProperties = (parentSeries) => {
        const { stroke, strokeThickness, opacity, isDigitalLine, lineType, drawNaNAs } = parentSeries;
        return {
            stroke,
            strokeThickness,
            strokeDashArray: [3, 4],
            isDigitalLine,
            lineType,
            drawNaNAs,
            containsNaN: true,
        };
    };
    // Add this as the first drawingProviders so it draws behind all pointmarkers
    lineSeries.drawingProviders.unshift(selectedLineDP);
    // Additional point drawing for selecetd points
    const triangleDP = new PointMarkerDrawingProvider(wasmContext, lineSeries, (ps) => ps.lowValues);
    triangleDP.getProperties = (series) => {
        return { pointMarker: trianglePM };
    };
    lineSeries.drawingProviders.push(triangleDP);
    // Apply the transform to all the drawingProviders
    lineSeries.renderDataTransform = new SplitRenderDataTransform(lineSeries, wasmContext, lineSeries.drawingProviders);
    sciChartSurface.renderableSeries.add(lineSeries);
    sciChartSurface.annotations.add(
        new NativeTextAnnotation({
            xCoordinateMode: ECoordinateMode.Pixel,
            yCoordinateMode: ECoordinateMode.Pixel,
            x1: 20,
            y1: 20,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            text: "Selected points are styled differently.  Click and drag to change the selection",
            textColor: appTheme.ForegroundColor,
            fontSize: 16,
            opacity: 0.77,
        })
    );
    // Optional: Add Interactivity Modifiers
    sciChartSurface.chartModifiers.add(
        new DataPointSelectionModifier({
            allowClickSelect: true,
            onSelectionChanged: (args) => {
                lineSeries.renderDataTransform.requiresTransform = true;
                columnSeries.renderDataTransform.requiresTransform = true;
            },
        })
    );
    // sciChartSurface.chartModifiers.add(new RolloverModifier({
    //     tooltipDataTemplate: (seriesInfo: SeriesInfo) => {
    //         const vals: string[] = [];
    //         vals.push(`X ${seriesInfo.formattedXValue}`);
    //         vals.push(`Y ${seriesInfo.formattedYValue}`);
    //         vals.push(`selected ${(seriesInfo.pointMetadata as IPointMetadata).isSelected}`);
    //         return vals;
    //     }
    // }));
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
