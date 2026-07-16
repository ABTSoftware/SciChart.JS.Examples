import { appTheme } from "../../../theme";
import {
    SciChart3DSurface,
    CameraController,
    Vector3,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    NumericAxis3D,
    LogarithmicAxis3D,
    NumberRange,
    ScatterRenderableSeries3D,
    XyzDataSeries3D,
    SpherePointMarker3D,
} from "scichart";

const SENSOR_COUNT = 8;
const POINTS_PER_SENSOR = 200;

const createSensorData = (sensor: number): { xValues: number[]; yValues: number[]; zValues: number[] } => {
    const xValues: number[] = new Array(POINTS_PER_SENSOR);
    const yValues: number[] = new Array(POINTS_PER_SENSOR);
    const zValues: number[] = new Array(POINTS_PER_SENSOR);

    const alpha = 0.4 + sensor * 0.18;
    const amplitude = 5e4 / (sensor + 1);

    for (let i = 0; i < POINTS_PER_SENSOR; i++) {
        const logFreq = (i / (POINTS_PER_SENSOR - 1)) * 5 + (Math.random() - 0.5) * 0.06;
        const freq = Math.pow(10, logFreq);
        const noise = 0.7 + Math.random() * 0.6;
        const psd = Math.max(amplitude * Math.pow(freq, -alpha) * noise, 1e-6);
        xValues[i] = freq;
        yValues[i] = psd;
        zValues[i] = sensor;
    }
    return { xValues, yValues, zValues };
};

const sensorColor = (sensor: number): string => {
    const t = sensor / (SENSOR_COUNT - 1);
    const r = Math.round(20 + t * 230);
    const g = Math.round(180 - t * 120);
    const b = Math.round(255 - t * 210);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const X_RANGE_LOG = new NumberRange(1, 1e5);
export const X_RANGE_LINEAR = new NumberRange(0, 1e5);
export const Y_RANGE_LOG = new NumberRange(1e-4, 1e5);
export const Y_RANGE_LINEAR = new NumberRange(0, 1e5);

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-300, 220, -280),
        target: new Vector3(0, 50, 0),
    });

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    sciChart3DSurface.xAxis = new LogarithmicAxis3D(wasmContext, {
        axisTitle: "Frequency (Hz)",
        logBase: 10,
        visibleRange: X_RANGE_LOG,
    });

    sciChart3DSurface.yAxis = new LogarithmicAxis3D(wasmContext, {
        axisTitle: "PSD (V²/Hz)",
        logBase: 10,
        visibleRange: Y_RANGE_LOG,
    });

    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Sensor",
        visibleRange: new NumberRange(-0.5, SENSOR_COUNT - 0.5),
    });

    for (let s = 0; s < SENSOR_COUNT; s++) {
        const { xValues, yValues, zValues } = createSensorData(s);
        const dataSeries = new XyzDataSeries3D(wasmContext, {
            xValues,
            yValues,
            zValues,
            dataSeriesName: `Sensor ${s + 1}`,
        });
        const scatter = new ScatterRenderableSeries3D(wasmContext, {
            dataSeries,
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 5, fill: sensorColor(s) }),
            opacity: 0.85,
        });
        sciChart3DSurface.renderableSeries.add(scatter);
    }

    return { sciChartSurface: sciChart3DSurface, wasmContext };
};
