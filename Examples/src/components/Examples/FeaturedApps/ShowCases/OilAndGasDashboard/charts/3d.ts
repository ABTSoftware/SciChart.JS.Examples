import { CameraController } from "scichart/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { XyzDataSeries3D } from "scichart/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import { QuadPointMarker, SpherePointMarker3D } from "scichart/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";
import { TSciChart3D } from "scichart/types/TSciChart3D";
import { appTheme } from "../theme";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

export default async function init3dChart(id: string) {

    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(id, { theme: appTheme.SciChartJsTheme });

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(300, 300, 300),
        target: new Vector3(0, 50, 0)
    });

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    const defaultPointMarker = new SpherePointMarker3D(wasmContext, { size: 10, fill: "#00FF00" });
    const series = new ScatterRenderableSeries3D(wasmContext, { pointMarker: defaultPointMarker });
    const seriesX = new ScatterRenderableSeries3D(wasmContext, { pointMarker: new QuadPointMarker(wasmContext, { size: 10, fill: "#00FF00" }) });
    const seriesY = new ScatterRenderableSeries3D(wasmContext, { pointMarker: new QuadPointMarker(wasmContext, { size: 10, fill: "#00FF00" }) });
    const seriesZ = new ScatterRenderableSeries3D(wasmContext, { pointMarker: new QuadPointMarker(wasmContext, { size: 10, fill: "#00FF00" }) });
    const data = getData(wasmContext);
    series.dataSeries = data.xyzDataSeries;
    seriesX.dataSeries = data.xyzDataSeriesX;
    seriesY.dataSeries = data.xyzDataSeriesY;
    seriesZ.dataSeries = data.xyzDataSeriesZ;
    sciChart3DSurface.renderableSeries.add(series);
    sciChart3DSurface.renderableSeries.add(seriesX);
    sciChart3DSurface.renderableSeries.add(seriesY);
    sciChart3DSurface.renderableSeries.add(seriesZ);

    return { sciChart3DSurface, wasmContext };
}
// HELPER FUNCTIONS FOR DATA GENERATION
function getData(wasmContext: TSciChart3D) {
    const xyzDataSeries = new XyzDataSeries3D(wasmContext);
    const xyzDataSeriesX = new XyzDataSeries3D(wasmContext);
    const xyzDataSeriesY = new XyzDataSeries3D(wasmContext);
    const xyzDataSeriesZ = new XyzDataSeries3D(wasmContext);
    const count = 1000;

    const fixedColor = parseColorToUIntArgb(appTheme.Chart3DScatterFill);
    const colorRange = [
        parseColorToUIntArgb(appTheme.Chart3DColor1),
        parseColorToUIntArgb(appTheme.Chart3DColor2),
        parseColorToUIntArgb(appTheme.Chart3DColor3),
        parseColorToUIntArgb(appTheme.Chart3DColor4),
        parseColorToUIntArgb(appTheme.Chart3DColor5),
        parseColorToUIntArgb(appTheme.Chart3DColor6),
        parseColorToUIntArgb(appTheme.Chart3DColor7)
    ];

    for (let i = 0; i < count; i++) {
        const x = getGaussianRandom(200, 40);
        const y = getGaussianRandom(200, 40);
        const z = getGaussianRandom(200, 40);

        const scale = (Math.random() + 0.5) * 0.5;
        // To declare scale and colour, add an optional PointMetadata3D type as the w (fourth) parameter.
        // The PointMetadata3D type also has other properties defining the behaviour of the XYZ point
        xyzDataSeries.append(x, y, z, { vertexColorAbgr: fixedColor, pointScale: scale });
        xyzDataSeriesX.append(0, y, z, { vertexColorAbgr: getColor(colorRange, y), pointScale: scale });
        xyzDataSeriesY.append(x, 0, z, { vertexColorAbgr: getColor(colorRange, z), pointScale: scale });
        xyzDataSeriesZ.append(x, y, 0, { vertexColorAbgr: getColor(colorRange, y), pointScale: scale });
    }

    return {
        xyzDataSeries,
        xyzDataSeriesX,
        xyzDataSeriesY,
        xyzDataSeriesZ
    };
}

function getColor(colors: number[], coord: number): number {

    const divider = 350 / 7;
    const index = Math.ceil(coord / divider) - 1;
    return colors[index];
}

function getGaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random(); // these are uniform(0,1) random doubles
    const u2 = Math.random();
    // random normal(0,1)
    const randStdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    // random normal(mean, stddev^2)
    return mean + stdDev * randStdNormal;
}
