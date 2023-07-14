<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="chart3d" style="width: 600px; height: 400px; margin: auto;"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { CameraController } from "scichart/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { XyzDataSeries3D } from "scichart/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import {
    QuadPointMarker,
    SpherePointMarker3D
} from "scichart/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";

async function initSciChart() {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create("chart3d");

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
    const series = new ScatterRenderableSeries3D(wasmContext, { pointMarker: defaultPointMarker });;
    const xyzDataSeries = new XyzDataSeries3D(wasmContext);

    const count = 1000;
    for (let i = 0; i < count; i++) {
         const x = getGaussianRandom(200, 40);
         const y = getGaussianRandom(200, 40);
         const z = getGaussianRandom(200, 40);

        const scale = (Math.random() + 0.5) * 0.5;
        const randomColor = Math.floor(Math.random() * 0xffffff) + 0xff000000;
         // To declare scale and colour, add an optional PointMetadata3D type as the w (fourth) parameter.
         // The PointMetadata3D type also has other properties defining the behaviour of the XYZ point
         xyzDataSeries.append(x, y, z, { vertexColor: 0xffa88d32, pointScale: scale });
     }
     series.dataSeries = xyzDataSeries;
     sciChart3DSurface.renderableSeries.add(series)
}

function getGaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random(); // these are uniform(0,1) random doubles
    const u2 = Math.random();
    // random normal(0,1)
    const randStdNormal = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    // random normal(mean, stddev^2)
    return mean + stdDev * randStdNormal;
}

export default defineComponent({
  setup() {
    onMounted(() => {
      console.log("execute onMounted");
      initSciChart();
    });
  },
  name: "Scichart3d",
  props: {
    msg: String
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
