import {
    FastLineRenderableSeries,
    GlowEffect,
    NumberRange,
    NumericAxis,
    PerformanceDebugHelper,
    SciChartSurface,
    XyDataSeries,
    EPerformanceMarkType
} from "scichart";

const AMPLITUDE = 200;
const POINTS_COUNT = 500;

const xValues = new Float64Array(POINTS_COUNT);
const yValues = new Float64Array(POINTS_COUNT);
const fillNoisySinewave = (
    pointCount: number,
    xMax: number,
    frequency: number,
    amplitude: number,
    noiseAmplitude: number,
    dataSeries: XyDataSeries
) => {
    const phase = frequency / xMax;
    const freq = 2 * Math.PI * phase;

    // dataSeries.capacity = Math.max(dataSeries.capacity, pointCount);

    for (let i = 0; i < pointCount; i++) {
        const x = (i * xMax) / (pointCount - 1);
        const y = amplitude * Math.sin(x * freq);
        const yNoise = (Math.random() - 0.5) * noiseAmplitude;
        xValues[i] = x;
        yValues[i] = y + yNoise;
    }

    dataSeries.appendRange(xValues, yValues);
};

const getNoisySinewave = (
    pointCount: number,
    xMax: number,
    frequency: number,
    amplitude: number,
    noiseAmplitude: number
) => {
    const phase = frequency / xMax;
    const freq = 2 * Math.PI * phase;

    for (let i = 0; i < pointCount; i++) {
        const x = (i * xMax) / (pointCount - 1);
        const y = amplitude * Math.sin(x * freq);
        const yNoise = (Math.random() - 0.5) * noiseAmplitude;
        xValues[i] = x;
        yValues[i] = y + yNoise;
    }
    return [xValues, yValues];
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, { id: "drawExample" });
    // TODO embed into SciChartReact
    const mark = PerformanceDebugHelper.mark(EPerformanceMarkType.SetupStart, { contextId: sciChartSurface.id });

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 900);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(-300, 300);
    sciChartSurface.yAxes.add(yAxis);

    // Testing performance with Rollover and Cursor modifiers
    // sciChartSurface.chartModifiers.add(new RolloverModifier());
    // sciChartSurface.chartModifiers.add(new CursorModifier({showTooltip: true}));

    const addSeries = (index: number, stroke: string) => {
        const amplitude = Math.random() * AMPLITUDE;
        const effect = new GlowEffect(wasmContext, {
            range: 0,
            intensity: 0.5
        });
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke, effect });
        lineSeries.strokeThickness = 3;
        sciChartSurface.renderableSeries.add(lineSeries);
        const [xValues, yValues] = getNoisySinewave(POINTS_COUNT, 900, 7, amplitude, 30);
        lineSeries.dataSeries = new XyDataSeries(wasmContext, {
            id: "ghostedDataSeriesId" + index,
            dataSeriesName: "ghostedDataSeriesName" + index,
            xValues,
            yValues,
            capacity: POINTS_COUNT
        });
        return lineSeries;
    };

    const series1 = addSeries(1, "rgba(192, 192, 192, 1)");
    const series2 = addSeries(2, "rgba(192, 192, 192, 0.9)");
    const series3 = addSeries(3, "rgba(192, 192, 192, 0.8)");
    const series4 = addSeries(4, "rgba(192, 192, 192, 0.7)");
    const series5 = addSeries(5, "rgba(192, 192, 192, 0.6)");
    const series6 = addSeries(6, "rgba(192, 192, 192, 0.5)");
    const series7 = addSeries(7, "rgba(192, 192, 192, 0.4)");
    const series8 = addSeries(8, "rgba(192, 192, 192, 0.3)");
    const series9 = addSeries(9, "rgba(192, 192, 192, 0.2)");
    const series10 = addSeries(10, "rgba(192, 192, 192, 0.1)");

    let isFinished: boolean = true;
    let frame = 0;
    let timeStart: number;

    const reassignRenderableSeries = async () => {
        if (isFinished) {
            const duration = Date.now() - timeStart;
            const FPS = (frame * 1000) / duration;
            console.log("duration", duration);
            console.log("frames", frame);
            console.log("FPS", Math.round(FPS));
            frame = 0;
        } else {
            const oldDataSeries = series10.dataSeries as XyDataSeries;
            series10.dataSeries = series9.dataSeries;
            series9.dataSeries = series8.dataSeries;
            series8.dataSeries = series7.dataSeries;
            series7.dataSeries = series6.dataSeries;
            series6.dataSeries = series5.dataSeries;
            series5.dataSeries = series4.dataSeries;
            series4.dataSeries = series3.dataSeries;
            series3.dataSeries = series2.dataSeries;
            series2.dataSeries = series1.dataSeries;

            const amplitude = Math.random() * AMPLITUDE;
            oldDataSeries.clear();
            fillNoisySinewave(POINTS_COUNT, 900, 7, amplitude, 30, oldDataSeries);
            series1.dataSeries = oldDataSeries;
            frame++;
            // setTimeout(reassignRenderableSeries, 17);
            await sciChartSurface.nextStateRender();
            reassignRenderableSeries();
        }
    };

    // Buttons for chart
    const startAnimation = () => {
        if (isFinished) {
            console.log("start animation");
            timeStart = Date.now();
            isFinished = false;
            reassignRenderableSeries();
        }
    };
    document.querySelector("#startAnimation").addEventListener("click", startAnimation);

    const stopAnimation = () => {
        console.log("stop animation");
        isFinished = true;
    };
    document.querySelector("#stopAnimation").addEventListener("click", stopAnimation);

    PerformanceDebugHelper.mark(EPerformanceMarkType.SetupEnd, {
        contextId: sciChartSurface.id,
        relatedId: mark?.detail?.relatedId
    });

    return { wasmContext, sciChartSurface };
};

export const drawExample2 = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.createSingle(rootElement, { id: "drawExample2" });
    // TODO embed into SciChartReact
    const mark = PerformanceDebugHelper.mark(EPerformanceMarkType.SetupStart, { contextId: sciChartSurface.id });

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 900);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(-300, 300);
    sciChartSurface.yAxes.add(yAxis);

    // Testing performance with Rollover and Cursor modifiers
    // sciChartSurface.chartModifiers.add(new RolloverModifier());
    // sciChartSurface.chartModifiers.add(new CursorModifier({showTooltip: true}));

    const addSeries = (stroke: string) => {
        const amplitude = Math.random() * AMPLITUDE;
        const effect = new GlowEffect(wasmContext, {
            range: 0,
            intensity: 0.5
        });
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke, effect });
        lineSeries.strokeThickness = 3;
        sciChartSurface.renderableSeries.add(lineSeries);
        const [xValues, yValues] = getNoisySinewave(POINTS_COUNT, 900, 7, amplitude, 30);
        lineSeries.dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
        return lineSeries;
    };

    const series1 = addSeries("rgba(192, 192, 192, 1)");
    const series2 = addSeries("rgba(192, 192, 192, 0.9)");
    const series3 = addSeries("rgba(192, 192, 192, 0.8)");
    const series4 = addSeries("rgba(192, 192, 192, 0.7)");
    const series5 = addSeries("rgba(192, 192, 192, 0.6)");
    const series6 = addSeries("rgba(192, 192, 192, 0.5)");
    const series7 = addSeries("rgba(192, 192, 192, 0.4)");
    const series8 = addSeries("rgba(192, 192, 192, 0.3)");
    const series9 = addSeries("rgba(192, 192, 192, 0.2)");
    const series10 = addSeries("rgba(192, 192, 192, 0.1)");

    let isFinished: boolean = true;
    let frame = 0;
    let timeStart: number;

    const reassignRenderableSeries = async () => {
        if (isFinished) {
            const duration = Date.now() - timeStart;
            const FPS = (frame * 1000) / duration;
            console.log("duration", duration);
            console.log("frames", frame);
            console.log("FPS", Math.round(FPS));
            frame = 0;
        } else {
            const oldDataSeries = series10.dataSeries;
            series10.dataSeries = series9.dataSeries;
            series9.dataSeries = series8.dataSeries;
            series8.dataSeries = series7.dataSeries;
            series7.dataSeries = series6.dataSeries;
            series6.dataSeries = series5.dataSeries;
            series5.dataSeries = series4.dataSeries;
            series4.dataSeries = series3.dataSeries;
            series3.dataSeries = series2.dataSeries;
            series2.dataSeries = series1.dataSeries;

            const amplitude = Math.random() * AMPLITUDE;
            const dataSeries = new XyDataSeries(wasmContext);
            fillNoisySinewave(POINTS_COUNT, 900, 7, amplitude, 30, dataSeries);
            series1.dataSeries = dataSeries;
            oldDataSeries.delete();
            frame++;
            // setTimeout(reassignRenderableSeries, 17);
            await sciChartSurface.nextStateRender();
            reassignRenderableSeries();
        }
    };

    // Buttons for chart
    const startAnimation = () => {
        if (isFinished) {
            console.log("start animation");
            timeStart = Date.now();
            isFinished = false;
            reassignRenderableSeries();
        }
    };
    document.querySelector("#startAnimation").addEventListener("click", startAnimation);

    const stopAnimation = () => {
        console.log("stop animation");
        isFinished = true;
    };
    document.querySelector("#stopAnimation").addEventListener("click", stopAnimation);

    PerformanceDebugHelper.mark(EPerformanceMarkType.SetupEnd, {
        contextId: sciChartSurface.id,
        relatedId: mark?.detail?.relatedId
    });

    return { wasmContext, sciChartSurface };
};

export const configureChart = async (sciChartSurface: SciChartSurface) => {
    const wasmContext = sciChartSurface.webAssemblyContext2D;

    // TODO embed into SciChartReact
    const mark = PerformanceDebugHelper.mark(EPerformanceMarkType.SetupStart, { contextId: sciChartSurface.id });

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 900);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(-300, 300);
    sciChartSurface.yAxes.add(yAxis);

    // Testing performance with Rollover and Cursor modifiers
    // sciChartSurface.chartModifiers.add(new RolloverModifier());
    // sciChartSurface.chartModifiers.add(new CursorModifier({showTooltip: true}));

    const addSeries = (stroke: string) => {
        const amplitude = Math.random() * AMPLITUDE;
        const effect = new GlowEffect(wasmContext, {
            range: 0,
            intensity: 0.5
        });
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke, effect });
        lineSeries.strokeThickness = 3;
        sciChartSurface.renderableSeries.add(lineSeries);
        const [xValues, yValues] = getNoisySinewave(POINTS_COUNT, 900, 7, amplitude, 30);
        lineSeries.dataSeries = new XyDataSeries(wasmContext, { xValues, yValues, capacity: POINTS_COUNT });
        return lineSeries;
    };

    const series1 = addSeries("rgba(192, 192, 192, 1)");
    const series2 = addSeries("rgba(192, 192, 192, 0.9)");
    const series3 = addSeries("rgba(192, 192, 192, 0.8)");
    const series4 = addSeries("rgba(192, 192, 192, 0.7)");
    const series5 = addSeries("rgba(192, 192, 192, 0.6)");
    const series6 = addSeries("rgba(192, 192, 192, 0.5)");
    const series7 = addSeries("rgba(192, 192, 192, 0.4)");
    const series8 = addSeries("rgba(192, 192, 192, 0.3)");
    const series9 = addSeries("rgba(192, 192, 192, 0.2)");
    const series10 = addSeries("rgba(192, 192, 192, 0.1)");

    let isFinished: boolean = true;
    let frame = 0;
    let timeStart: number;

    const reassignRenderableSeries = async () => {
        if (isFinished) {
            const duration = Date.now() - timeStart;
            const FPS = (frame * 1000) / duration;
            console.log("duration", duration);
            console.log("frames", frame);
            console.log("FPS", Math.round(FPS));
            frame = 0;
        } else {
            const oldDataSeries = series10.dataSeries as XyDataSeries;
            series10.dataSeries = series9.dataSeries;
            series9.dataSeries = series8.dataSeries;
            series8.dataSeries = series7.dataSeries;
            series7.dataSeries = series6.dataSeries;
            series6.dataSeries = series5.dataSeries;
            series5.dataSeries = series4.dataSeries;
            series4.dataSeries = series3.dataSeries;
            series3.dataSeries = series2.dataSeries;
            series2.dataSeries = series1.dataSeries;

            const amplitude = Math.random() * AMPLITUDE;
            oldDataSeries.clear();
            fillNoisySinewave(POINTS_COUNT, 900, 7, amplitude, 30, oldDataSeries);
            series1.dataSeries = oldDataSeries;
            frame++;
            // setTimeout(reassignRenderableSeries, 17);
            await sciChartSurface.nextStateRender();
            reassignRenderableSeries();
        }
    };

    PerformanceDebugHelper.mark(EPerformanceMarkType.SetupEnd, {
        contextId: sciChartSurface.id,
        relatedId: mark?.detail?.relatedId
    });

    return { wasmContext, sciChartSurface };
};
