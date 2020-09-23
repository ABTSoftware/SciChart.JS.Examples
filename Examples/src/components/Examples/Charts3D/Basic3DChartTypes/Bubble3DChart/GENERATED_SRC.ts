export const code = `import * as React from "react";
import { CameraController } from "scichart3d/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart3d/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart3d/Charting3D/ChartModifiers/OrbitModifier3D";
import { XyzDataSeries3D } from "scichart3d/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { Vector3 } from "scichart3d/Charting3D/Vector3";
import { NumericAxis3D } from "scichart3d/Charting3D/Visuals/Axis/NumericAxis3D";
import { SpherePointMarker3D } from "scichart3d/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart3d/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import { SciChart3DSurface } from "scichart3d/Charting3D/Visuals/SciChart3DSurface";
import { TSciChart3D } from "scichart3d/types/TSciChart3D";
import { SciChartSurface } from "scichart";

const divElementId = "chart";

// SCICHART CODE
const drawExample = async () => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId);
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(300, 300, 300),
        target: new Vector3(0, 50, 0),
    });

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    const defaultPointMarker = new SpherePointMarker3D(wasmContext, { size: 10, fill: "#00FF00" });
    const series = new ScatterRenderableSeries3D(wasmContext, { pointMarker: defaultPointMarker });

    series.dataSeries = getData(wasmContext);
    sciChart3DSurface.renderableSeries.add(series);

    return { sciChart3DSurface, wasmContext };
};

// HELPER FUNCTIONS FOR DATA GENERATION
function getData(wasmContext: TSciChart3D) {
    const xyzDataSeries = new XyzDataSeries3D(wasmContext);
    const count = 250;
    for (let i = 0; i < count; i++) {
        const x = getGaussianRandom(150, 40);
        const y = getGaussianRandom(100, 20);
        const z = getGaussianRandom(150, 40);

        const scale = (Math.random() + 0.5) * 0.5;
        const randomColor = Math.floor(Math.random() * 16777215);

        // To declare scale and colour, add an optional PointMetadata3D type as the w (fourth) parameter.
        // The PointMetadata3D type also has other properties defining the behaviour of the XYZ point
        xyzDataSeries.append(x, y, z, { vertexColorAbgr: randomColor, pointScale: scale });
    }

    return xyzDataSeries;
}

function getGaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random(); // these are uniform(0,1) random doubles
    const u2 = Math.random();
    // random normal(0,1)
    const randStdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    // random normal(mean, stddev^2)
    return mean + stdDev * randStdNormal;
}

// REACT COMPONENT
export default function Bubble3DChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChart3DSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChart3DSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
`;