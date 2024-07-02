import { 
    XyDataSeries, 
    NumericAxis, 
    FastLineRenderableSeries, 
    SciChartSurface, 
    EAutoRange, 
    HorizontalLineAnnotation, 
    NumberRange
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    
    // Create X Axis
    const xAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        autoRange: EAutoRange.Always,

        isStaticAxis: true, // gridlines and axis labels keep their initial position on visible range change
        drawMajorBands: false, // helps to avoid flickering - when visible range changes fast
    });
    sciChartSurface.xAxes.add(xAxis);
    
    // Create Y Axis
    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
    });
    sciChartSurface.yAxes.add(yAxis);

    // fix the visible range of the Y axis to always be symmetrical around 0
    yAxis.visibleRangeChanged.subscribe(() => {
        const max = Math.max(Math.abs(yAxis.visibleRange.min), Math.abs(yAxis.visibleRange.max));
        yAxis.visibleRange = new NumberRange(-max, max);
    });

    // build data series
    let height = 0.1;
    const xValues = [];
    const yValues = [];
    const fifoCapacity = 1000;
    let i = 0;
    for (; i < fifoCapacity; i++) {
        xValues.push(i);
        yValues.push(height * (Math.sin(i * 0.01) - Math.cos(i * 0.01)));
    }

    // Add a line series with initial data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        fifoCapacity
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: appTheme.VividPurple,
            strokeThickness: 4,
        })
    );

    const updateCallback = () => {
        const xUpdate = [];
        const yUpdate = [];
        height *= 1.005;
        for (let j = 0; j < 2; i++, j++) {
            xUpdate.push(i);
            yUpdate.push(height * (Math.sin(i * 0.01) - Math.cos(i * 0.01)));
        }
        dataSeries.appendRange(xUpdate, yUpdate);
    }

    setInterval(updateCallback, 10);

    // line annotation at x = 0
    sciChartSurface.annotations.add(new HorizontalLineAnnotation({
        stroke: "white",
        opacity: 0.5,
        strokeThickness: 2,
        y1: 0
    }));

    sciChartSurface.zoomExtents();

    function toggleStaticAxis(){
        xAxis.isStaticAxis = !xAxis.isStaticAxis;
    }

    return { sciChartSurface, wasmContext, controls: { toggleStaticAxis } };
};
