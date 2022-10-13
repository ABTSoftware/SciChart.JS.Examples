import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { CameraController } from "scichart/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { XyzDataSeries3D } from "scichart/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import { BasePointMarker3D } from "scichart/Charting3D/Visuals/PointMarkers/BasePointMarker3D";
import { EllipsePointMarker3D, QuadPointMarker, SpherePointMarker3D } from "scichart/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";
import { TSciChart3D } from "scichart/types/TSciChart3D";
import {theme} from "../theme";
import {
    SciChartJSLightTheme
} from "../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/SciChartJSLightTheme";
import {
    SciChartJSDarkTheme
} from "../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/SciChartJSDarkTheme";

export default async function init3dChart(id: string) {

    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(id, { theme });

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
    for (let i = 0; i < count; i++) {
        const x = getGaussianRandom(200, 40);
        const y = getGaussianRandom(200, 40);
        const z = getGaussianRandom(200, 40);

        const scale = (Math.random() + 0.5) * 0.5;
        const randomColor = Math.floor(Math.random() * 0xffffff) + 0xff000000;
        // To declare scale and colour, add an optional PointMetadata3D type as the w (fourth) parameter.
        // The PointMetadata3D type also has other properties defining the behaviour of the XYZ point
        xyzDataSeries.append(x, y, z, { vertexColorAbgr: 0xffa88d32, pointScale: scale });
        xyzDataSeriesX.append(0, y, z, { vertexColorAbgr: getColor(y), pointScale: scale });
        xyzDataSeriesY.append(x, 0, z, { vertexColorAbgr: getColor(z), pointScale: scale });
        xyzDataSeriesZ.append(x, y, 0, { vertexColorAbgr: getColor(y), pointScale: scale });
    }

    return {
        xyzDataSeries,
        xyzDataSeriesX,
        xyzDataSeriesY,
        xyzDataSeriesZ
    };
}

function getColor(coord: number): number {
    const colors = [0xff0a0aae, 0xff2964ba, 0xff36e15a, 0xfff7e24d, 0xffb8e946, 0xffdd8037, 0xffa81d09];        
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
