import {
    XyDataSeries,
    NumericAxis,
    FastLineRenderableSeries,
    SciChartSurface,
    EAutoRange,
    HorizontalLineAnnotation,
    NumberRange,
    EAxisAlignment,
} from "scichart";
import { appTheme } from "../../../theme";
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: "#FFFFFF22", // make gridlines more noticeable
        },
    });
    // Create X Axis
    const staticXAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        autoRange: EAutoRange.Always,
        axisAlignment: EAxisAlignment.Top,
        axisTitle: "Static Axis",
        isStaticAxis: true, // when true, gridlines and axis labels keep their initial position on visible range change
        // drawMajorBands: false, // avoids flickering - when values change fast and isStaticAxis is true
    });
    const xAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        autoRange: EAutoRange.Always,
        axisAlignment: EAxisAlignment.Bottom,
        axisTitle: "Normal Axis",
        id: "Normal",
        isStaticAxis: false, // when true, gridlines and axis labels keep their initial position on visible range change
        // drawMajorBands: false, // avoids flickering - when values change fast and isStaticAxis is true
    });
    staticXAxis.visibleRangeChanged.subscribe((data) => (xAxis.visibleRange = data.visibleRange));
    sciChartSurface.xAxes.add(staticXAxis, xAxis);
    // Create Y Axis
    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-2, 2),
    });
    sciChartSurface.yAxes.add(yAxis);
    // build data series
    const xValues = [];
    const yValues = [];
    const fifoCapacity = 1000;
    let i = 0;
    const makeY = (x) => Math.sin(x * 0.05) - 0.1 * Math.sin(x * 0.1) - Math.cos(x * 0.005);
    for (; i < fifoCapacity; i++) {
        xValues.push(i);
        yValues.push(makeY(i));
    }
    // Add a line series with initial data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        fifoCapacity,
    });
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
        })
    );
    const updateCallback = () => {
        const xUpdate = [];
        const yUpdate = [];
        for (let j = 0; j < 2; i++, j++) {
            xUpdate.push(i);
            yUpdate.push(makeY(i));
        }
        dataSeries.appendRange(xUpdate, yUpdate);
    };
    setInterval(updateCallback, 10);
    // line annotation at x = 0
    sciChartSurface.annotations.add(
        new HorizontalLineAnnotation({
            stroke: "#FFFFFF44",
            strokeThickness: 1,
            y1: 0,
        })
    );
    function toggleStaticAxis() {
        if (staticXAxis.isPrimaryAxis) {
            xAxis.isPrimaryAxis = true;
        } else {
            staticXAxis.isPrimaryAxis = true;
        }
    }
    return { sciChartSurface, wasmContext, controls: { toggleStaticAxis } };
};
