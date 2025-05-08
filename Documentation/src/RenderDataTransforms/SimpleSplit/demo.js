import { DataPointSelectionModifier, makeIncArray, NumberRange, NumericAxis, PointMarkerDrawingProvider, SciChartJsNavyTheme, SciChartSurface, SquarePointMarker, TrianglePointMarker, XyDataSeries, XyScatterRenderableSeries, XyyBaseRenderDataTransform } from "scichart";
// #region ExampleA
// Using XyyBaseRenderDataTransform here because you cannot extend the abstract BaseRenderDataTransform when using browser bundle
class SplitBySelectedDataTransform extends XyyBaseRenderDataTransform {
    runTransformInternal(renderPassData) {
        // Guard in case the incoming data is empty
        // If you want to do nothing and draw the original data, you don't need to copy it, you can just return renderPassData.pointSeries
        if (!renderPassData.pointSeries) {
            return this.pointSeries;
        }
        // It is important to reuse this.pointSeries.  Do NOT create a new pointSeries on each transform
        const { xValues: oldX, yValues: oldY, indexes: oldI, resampled } = renderPassData.pointSeries;
        const { xValues, yValues, y1Values, indexes } = this.pointSeries;
        // Clear the target vectors
        xValues.clear();
        yValues.clear();
        y1Values.clear();
        indexes.clear();
        // indexRange tells the drawing to only use a subset of the data.  If data has been resampled, then always use all of it
        const iStart = resampled ? 0 : renderPassData.indexRange.min;
        const iEnd = resampled ? oldX.size() - 1 : renderPassData.indexRange?.max;
        const ds = this.parentSeries.dataSeries;
        for (let i = iStart; i <= iEnd; i++) {
            // If data has been resampled, we need the original index in order to get the correct metadata
            const index = resampled ? oldI.get(i) : i;
            const md = ds.getMetadataAt(index);
            xValues.push_back(oldX.get(i));
            indexes.push_back(index);
            // Push the y value to the desired target vector
            if (md.isSelected) {
                yValues.push_back(Number.NaN);
                y1Values.push_back(oldY.get(i));
            }
            else {
                yValues.push_back(oldY.get(i));
                y1Values.push_back(Number.NaN);
            }
        }
        // Return the transformed pointSeries.
        return this.pointSeries;
    }
}
// #endregion
async function simpleSplit(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    // #region ExampleB
    const xValues = makeIncArray(50);
    const yValues = makeIncArray(50, 1, y => Math.sin(y * 0.2));
    // Create metaData with some points selected
    const metadata = xValues.map(x => ({ isSelected: x > 10 && x < 20 }));
    const renderableSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            metadata
            //containsNaN: true,
        }),
        pointMarker: new TrianglePointMarker(wasmContext, {
            width: 10,
            height: 10,
            stroke: "green",
            fill: "green"
        })
    });
    // Create a second PointMarkerDrawingProvider with a ySelector so that it uses y1Values
    const selectedPointDrawingProvider = new PointMarkerDrawingProvider(wasmContext, renderableSeries, ps => ps.y1Values);
    // Create a different pointMarker
    const squarePM = new SquarePointMarker(wasmContext, {
        width: 10,
        height: 10,
        stroke: "red",
        fill: "red"
    });
    // Tell the new drawingProvider to use the new pointmarker instead of the one from the series.
    selectedPointDrawingProvider.getProperties = () => ({
        pointMarker: squarePM
    });
    // Add the new drawingProvider to the series
    renderableSeries.drawingProviders.push(selectedPointDrawingProvider);
    // Create the transform and add it to the series.  Pass the drawingProviders array as this transform applies to all of them
    renderableSeries.renderDataTransform = new SplitBySelectedDataTransform(renderableSeries, wasmContext, renderableSeries.drawingProviders);
    sciChartSurface.renderableSeries.add(renderableSeries);
    // Add Datapoint selection to allow updating the state on which the transform depends
    sciChartSurface.chartModifiers.add(new DataPointSelectionModifier({
        allowClickSelect: true,
        onSelectionChanged: args => {
            // Since the transform depends on the selection state, we must tell the transform that it must run when the selection changes.
            renderableSeries.renderDataTransform.requiresTransform = true;
        }
    }));
    // #endregion
    sciChartSurface.zoomExtents();
}
simpleSplit("scichart-root");
