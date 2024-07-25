import * as React from "react";
import classes from "../../../styles/Examples.module.scss";

import {
    BaseRenderDataTransform,
    DataPointSelectionModifier,
    EllipsePointMarker,
    FastColumnRenderableSeries,
    GradientParams,
    IPointMarker,
    IPointMetadata,
    IPointSeries,
    IXyPointSeries,
    IXyyPointSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    Point,
    PointMarkerDrawingProvider,
    RenderPassData,
    RolloverModifier,
    SciChartSurface,
    SeriesInfo,
    SweepAnimation,
    TrianglePointMarker,
    XyDataSeries,
    XyScatterRenderableSeries,
    XyyPointSeriesResampled,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";
import { ColumnSeriesDrawingProvider } from "scichart";

const divElementId = "chart";

class SplitRenderDataTransform extends BaseRenderDataTransform<XyyPointSeriesResampled> {
    protected createPointSeries(): XyyPointSeriesResampled {
        return new XyyPointSeriesResampled(this.wasmContext, new NumberRange(0, 0));
    }
    protected runTransformInternal(renderPassData: RenderPassData): IPointSeries {
        const { xValues: oldX, yValues: oldY, indexes: oldI, resampled } = renderPassData.pointSeries;
        const { xValues, yValues, y1Values, indexes } = this.pointSeries;
        xValues.clear();
        yValues.clear();
        y1Values.clear();
        indexes.clear();
        const iStart = resampled ? 0 : renderPassData.indexRange.min;
        const iEnd = resampled ? oldX.size() - 1 : renderPassData.indexRange?.max;
        const ds = this.parentSeries.dataSeries as XyDataSeries;
        for (let i = iStart; i <= iEnd; i++) {
            const index = resampled ? oldI.get(i) : i;
            const md = ds.getMetadataAt(index);
            xValues.push_back(oldX.get(index));
            indexes.push_back(oldI.get(index));
            if (md.isSelected) {
                yValues.push_back(NaN);
                y1Values.push_back(oldY.get(index));
            } else {
                yValues.push_back(oldY.get(index));
                y1Values.push_back(NaN);
            }
        }
        return this.pointSeries;
    }
}

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Create some xValues, yValues arrays
    const xValues = Array.from({ length: 20 }, (x, i) => i);
    const yValues = xValues.map((x) => 3 * x + x * Math.random());
    const metadata = xValues.map((x) => ({
        isSelected: Math.random() < 0.5,
    }));

    const trianglePM = new TrianglePointMarker(wasmContext, {
        width: 15,
        height: 15,
        strokeThickness: 0,
        fill: appTheme.VividOrange,
    });

    // Create a Scatter Series with Multiple point markers
    const series = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, metadata }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 14,
            height: 14,
            strokeThickness: 0,
            fill: appTheme.VividSkyBlue,
        }),
        opacity: 0.67,
        //animation: new SweepAnimation({ duration: 600, fadeEffect: true })
    });
    // Additional DrawingProvider that uses y1Values and different pointMarker config.
    const triangleDP = new PointMarkerDrawingProvider(wasmContext, series, (ps) => (ps as IXyyPointSeries).y1Values);
    triangleDP.getProperties = (series) => {
        return { pointMarker: trianglePM as IPointMarker };
    };
    series.drawingProviders.push(triangleDP);
    // RenderDataTransform to to Xy into Xyy according to metadata
    series.renderDataTransform = new SplitRenderDataTransform(series, wasmContext, series.drawingProviders);

    sciChartSurface.renderableSeries.add(series);

    const colxValues = [2, 4, 6, 8, 10, 12, 14, 16, 18];
    const colyValues = colxValues.map((x) => Math.random() * 50);
    const colmetadata = colxValues.map((x) => ({
        isSelected: Math.random() < 0.5,
    }));
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.MutedRed, offset: 0 },
            { color: appTheme.MutedTeal, offset: 1 },
        ]),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: colxValues,
            yValues: colyValues,
            metadata: colmetadata,
        }),
        stroke: undefined,
    });
    const selectedColDP = new ColumnSeriesDrawingProvider(
        wasmContext,
        columnSeries,
        (ps) => (ps as IXyyPointSeries).y1Values
    );
    selectedColDP.getProperties = (parentSeries) => {
        const { stroke, strokeThickness, fill } = parentSeries;
        return {
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.MutedRed + "66", offset: 0 },
                { color: appTheme.MutedTeal + "66", offset: 1 },
            ]),
            opacity: 1,
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

    // Optional: Add Interactivity Modifiers
    //sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(
        new DataPointSelectionModifier({
            allowClickSelect: true,
            onSelectionChanged: (args) => {
                series.renderDataTransform.requiresTransform = true;
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

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MultiplePointMarkers() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
