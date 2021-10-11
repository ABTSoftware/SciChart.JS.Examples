import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { Point } from "scichart/Core/Point";
import { AxisBase2D } from "scichart/Charting/Visuals/Axis/AxisBase2D";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";


const isPointWithinAxis = (point, axis) => {
    return point.x * DpiHelper.PIXEL_RATIO > axis.viewRect.left 
        && point.x * DpiHelper.PIXEL_RATIO < axis.viewRect.right
        && point.y * DpiHelper.PIXEL_RATIO > axis.viewRect.top 
        && point.y * DpiHelper.PIXEL_RATIO < axis.viewRect.bottom;
};


const announceWithSpeechSynthesis = (announcement) => {
    console.log(announcement)
    const synthDescription = new SpeechSynthesisUtterance(announcement);
    window.speechSynthesis.speak(synthDescription);
};

const debounce = (func, timeout = 1000) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
    };
};

const announceAxis = debounce((axis) => {
    const from = axis.labelProvider.formatLabel(axis.visibleRange.min);
    const to = axis.labelProvider.formatLabel(axis.visibleRange.max);
    const axisDescription = `${axis.axisTitle} with visible range from ${from} to ${to} `;
    announceWithSpeechSynthesis(axisDescription);
});

const announcePointOnDataSeries = debounce(announceWithSpeechSynthesis);

export async function voiceOverDataSeries(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "Horizontal Axis" });
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "Vertical Axis" });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Primary Data Series",
        xValues: [1, 2, 3, 4, 5],
        yValues: [8, 6, 7, 2, 16]
    });
    const renderableSeries = new FastLineRenderableSeries(wasmContext, { strokeThickness: 5, dataSeries });
    sciChartSurface.renderableSeries.add(renderableSeries);

    sciChartSurface.zoomExtents();


    const voiceOverDataPoint = (series, hitTestInfo) => {
        const { hitTestPointValues } = hitTestInfo;
        const xCoordValue = series.xAxis.labelProvider.formatLabel(hitTestPointValues.x);
        const yCoordValue = series.yAxis.labelProvider.formatLabel(hitTestPointValues.y);
        const pointDescription = `Point at coordinates ${xCoordValue} and ${yCoordValue}`;
        announcePointOnDataSeries(pointDescription);
    }

    const hitTestDataPoints = (point) => {
        const HIT_TEST_RADIUS = 10 * DpiHelper.PIXEL_RATIO;

        sciChartSurface.renderableSeries.asArray().forEach(series => {
            if (series.hitTestProvider) {
                const hitTestInfo = series.hitTestProvider.hitTest(
                    point.x * DpiHelper.PIXEL_RATIO,
                    point.y * DpiHelper.PIXEL_RATIO,
                    HIT_TEST_RADIUS,
                );

                if (hitTestInfo.isHit) {
                    voiceOverDataPoint(series, hitTestInfo);
                }
            }
        });
    };

    const hitTestAxes = (point) => {
        sciChartSurface.xAxes.asArray().forEach(axis => {
            if (isPointWithinAxis(point, axis)) {
                announceAxis(axis);
            }
        });

        sciChartSurface.yAxes.asArray().forEach(axis => {
            if (isPointWithinAxis(point, axis)) {
                announceAxis(axis);
            }
        });
    }

    // add voice over for data points and axes
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent) => {
        const point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        hitTestAxes(point);
        hitTestDataPoints(point);
    });
}

export async function voiceOverVisibleRange(divElementId) {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { axisTitle: "Horizontal Axis" });
    const yAxis = new NumericAxis(wasmContext, { axisTitle: "Vertical Axis" });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
    );

    sciChartSurface.zoomExtents();

    const announceYRangeChange = debounce(announceWithSpeechSynthesis);
    const announceXRangeChange = debounce(announceWithSpeechSynthesis);

    // add announcement of axis range changes
    yAxis.visibleRangeChanged.subscribe((args) => {
        const { min, max } = args.visibleRange;
        const from = yAxis.labelProvider.formatLabel(min);
        const to = yAxis.labelProvider.formatLabel(max);
        const announcement = `${yAxis.axisTitle} range changed, now it's from ${from} to ${to}.`;
        announceYRangeChange(announcement);
    });

    xAxis.visibleRangeChanged.subscribe((args) => {
        const { min, max } = args.visibleRange;
        const from = xAxis.labelProvider.formatLabel(min);
        const to = xAxis.labelProvider.formatLabel(max);
        const announcement = `${xAxis.axisTitle} range changed, now it's from ${from} to ${to}.`;
        announceXRangeChange(announcement);
    });
}
