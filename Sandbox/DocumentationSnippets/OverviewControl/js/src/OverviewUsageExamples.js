import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { MouseWheelZoomModifier } from 'scichart/Charting/ChartModifiers/MouseWheelZoomModifier';
import { ZoomExtentsModifier } from 'scichart/Charting/ChartModifiers/ZoomExtentsModifier';
import { EllipsePointMarker } from 'scichart/Charting/Visuals/PointMarkers/EllipsePointMarker';
import { FastMountainRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries';
import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { ESeriesType } from 'scichart/types/SeriesType';
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { SciChartOverview } from "scichart/Charting/Visuals/SciChartOverview";
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';
import { Thickness } from 'scichart/Core/Thickness';


const generateDataSeries = (dataSeries) => {
    const numberOfPoints = 10000;

    const xValues = new Array(numberOfPoints);
    const yValues = new Array(numberOfPoints);
    let prevYValue = 0;
    for (let i = 0; i < numberOfPoints; i++) {
        const curYValue = Math.random() * 10 - 5;

        xValues[i] = i;
        yValues[i] = prevYValue + curYValue;

        prevYValue += curYValue;
    }

    dataSeries.appendRange(xValues, yValues);
};

export const basicOverviewControl = async (divElementId, overviewDivElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    generateDataSeries(dataSeries);
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries });
    sciChartSurface.renderableSeries.add(rendSeries);

    // Add default Horizontal Overview
    const overview = await SciChartOverview.create(sciChartSurface, overviewDivElementId);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
};

export const configuringOverviewControl = async (divElementId, overviewDivElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    generateDataSeries(dataSeries);
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries });
    sciChartSurface.renderableSeries.add(rendSeries);

    // Add default Horizontal Overview
    const overview = await SciChartOverview.create(sciChartSurface, overviewDivElementId);

    // add styling to the overview component
    overview.applyTheme(new SciChartJSLightTheme());
    overview.overviewSciChartSurface.padding = Thickness.fromNumber(20);
    overview.overviewXAxis.isVisible = true;

    overview.rangeSelectionModifier.rangeSelectionAnnotation.svgString =
        `<svg width="50" height="50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" style="fill:red">
        </rect>
        </svg>`;

    // Custom SVG template function for grab handles of the selection control
    overview.rangeSelectionModifier.rangeSelectionAnnotation.adornerSvgStringTemplate =
        (x1, y1, x2, y2) => {
            const delta = 3;
            const ADORNER_GRIP_RADIUS = 10;
            return `<svg xmlns="http://www.w3.org/2000/svg">
            <line x1="${x1 - delta}" y1="${y1}" x2="${x2 + delta}" y2="${y1}" stroke="red" stroke-width="6" />
            <line x1="${x2}" y1="${y1 + delta}" x2="${x2}" y2="${y2 - delta}" stroke="red" stroke-width="6" />
            <line x1="${x1 - delta}" y1="${y2}" x2="${x2 + delta}" y2="${y2}" stroke="red" stroke-width="6" />
            <line x1="${x1}" y1="${y1 + delta}" x2="${x1}" y2="${y2 - delta}" stroke="red" stroke-width="6" />
            <circle cx="${x1}" cy="${y1 / 2 + y2 / 2}" r="${ADORNER_GRIP_RADIUS}" fill="blue" stroke="green"/>
            <circle cx="${x2}" cy="${y1 / 2 + y2 / 2}" r="${ADORNER_GRIP_RADIUS}" fill="blue" stroke="green"/>
            </svg>`;
        };
};

export const optionalParamsForOverviewControl = async (divElementId, overviewDivElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { id: "xAxis" });
    const yAxis = new NumericAxis(wasmContext, { id: "yAxis" });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    generateDataSeries(dataSeries);
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries });

    const dataSeries2 = new XyDataSeries(wasmContext);
    generateDataSeries(dataSeries2);
    const rendSeries2 = new XyScatterRenderableSeries(wasmContext, { dataSeries: dataSeries2, pointMarker: new EllipsePointMarker(wasmContext) });

    rendSeries.xAxisId = xAxis.id;
    rendSeries.yAxisId = yAxis.id;
    rendSeries2.xAxisId = xAxis.id;
    rendSeries2.yAxisId = yAxis.id;

    sciChartSurface.renderableSeries.add(rendSeries, rendSeries2);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    // projects original renderable series to the overview
    const customTransformFunction = (renderableSeries) => {
        // return undefined to skip
        if (renderableSeries.xAxisId !== xAxis.id || renderableSeries.yAxisId !== yAxis.id) {
            return undefined;
        }

        if (renderableSeries.type !== ESeriesType.LineSeries) {
            return undefined;
        }

        return new FastMountainRenderableSeries(wasmContext, {
            dataSeries: renderableSeries.dataSeries
        });
    };

    // Add Overview
    const overview = await SciChartOverview.create(sciChartSurface, overviewDivElementId, {
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
        transformRenderableSeries: customTransformFunction,
    });

    return { wasmContext, sciChartSurface };
};

export const verticalChartOverview = async (divElementId, overviewDivElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, {axisAlignment: EAxisAlignment.Left});
    const yAxis = new NumericAxis(wasmContext, {axisAlignment: EAxisAlignment.Bottom});

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    generateDataSeries(dataSeries);
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries });
    sciChartSurface.renderableSeries.add(rendSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    // Add default Horizontal Overview
    const overview = await SciChartOverview.create(sciChartSurface, overviewDivElementId);
};
