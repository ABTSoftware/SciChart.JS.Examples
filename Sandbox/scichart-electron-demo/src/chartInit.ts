import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
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
import { parseColorToUIntArgb } from "scichart/utils/parseColor";

// You may need this to configure from where wasm and data files are served
// SciChart.SciChartSurface.configure({ dataUrl: "/custom/scichart2d.data" wasmUrl: "/other/scichart2d.wasm" });

async function init2dChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
        "scichart-root"
    );

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 5, 8, 10],
        yValues: [3, 1, 7, 5, 8],
    });
    const renderableSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "steelblue",
    });
    sciChartSurface.renderableSeries.add(renderableSeries);
}


async function init3dChart() {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create("scichart-3d-root");

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
    const data = getData(wasmContext);
    series.dataSeries = data.xyzDataSeries;

    sciChart3DSurface.renderableSeries.add(series);


    return { sciChart3DSurface, wasmContext };
}
// HELPER FUNCTIONS FOR DATA GENERATION
function getData(wasmContext: TSciChart3D) {
    const xyzDataSeries = new XyzDataSeries3D(wasmContext);
    const count = 1000;

    const fixedColor = parseColorToUIntArgb("blue");

    for (let i = 0; i < count; i++) {
        const x = getGaussianRandom(200, 40);
        const y = getGaussianRandom(200, 40);
        const z = getGaussianRandom(200, 40);

        const scale = (Math.random() + 0.5) * 0.5;
        // To declare scale and colour, add an optional PointMetadata3D type as the w (fourth) parameter.
        // The PointMetadata3D type also has other properties defining the behaviour of the XYZ point
        xyzDataSeries.append(x, y, z, { vertexColorAbgr: fixedColor, pointScale: scale });

    }

    return {
        xyzDataSeries,
    };
}

function getGaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random(); // these are uniform(0,1) random doubles
    const u2 = Math.random();
    // random normal(0,1)
    const randStdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    // random normal(mean, stddev^2)
    return mean + stdDev * randStdNormal;
}


init2dChart();
init3dChart();