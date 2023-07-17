<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="chart3d" style="width: 600px; height: 400px; margin: auto;"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  CameraController,
  MouseWheelZoomModifier3D,
  OrbitModifier3D,
  Vector3,
  NumericAxis3D,
  SciChart3DSurface,
  SciChartJsNavyTheme,
  ResetCamera3DModifier,
  NumberRange,
  EMeshPaletteMode,
  EDrawMeshAs,
  SurfaceMeshRenderableSeries3D,
  GradientColorPalette,
  UniformGridDataSeries3D
} from "scichart";

// Generates some example data for this demo, returning a 2D array of numbers [zIndex][xIndex]
const generateData = (xSize, zSize) => {
  const heightmapArray = [];
  const wc = xSize*0.5, hc = zSize*0.5;
  const freq = Math.sin(0.5)*0.1 + 0.1;
  for (let z = 0; z < zSize; z++) {
    heightmapArray[z] = [];
    for (let x = 0; x < xSize; x++) {
      const radius = Math.sqrt((wc - z)*(wc - z) + (hc - x)*(hc - x));
      const d = Math.PI*radius*freq;
      const value = Math.sin(d)/d;
      heightmapArray[z][x] = isNaN(value) ? 1.0 : value;
    }
  }
  return heightmapArray;
}


async function initSciChart() {
  // Create a SciChart3DSurface in the host <div id=".." />
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create("chart3d", {
    theme: new SciChartJsNavyTheme(),
    // worldDimensions: new Vector3(300, 200, 300),
    // cameraOptions: {
    //   position: new Vector3(-300, 300, -300),
    //   target: new Vector3(0, 50, 0),
    // }
  });
  sciChart3DSurface.camera = new CameraController(wasmContext, {
    position: new Vector3(-300, 300, -300),
    target: new Vector3(0, 50, 0),
  });

  // Add mouse interactivity
  sciChart3DSurface.chartModifiers.add(new OrbitModifier3D(), new MouseWheelZoomModifier3D(), new ResetCamera3DModifier());

  // Declare your X,Y,Z axis
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis", visibleRange: new NumberRange(0, 1) });
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

  // Create a 2D array and fill this with data. returns 2D array [zIndex][xIndex]
  const heightmapArray = generateData(40, 40);

  const dataSeries = new UniformGridDataSeries3D(wasmContext, {
    yValues: heightmapArray,
    xStep: 1, // Defines each cell in X occupies 1 data point on the X axis
    zStep: 1, // Defines each cell in Z occupies 1 data point on the Z axis
    dataSeriesName: "Uniform Surface Mesh"
  });

// Create the color map. GradientColorPalette maps heightMap values to a color range
  const colorMap = new GradientColorPalette(wasmContext, {
    gradientStops: [
      {offset: 1, color: "#EC0F6C"},
      {offset: 0.55, color: "#F48420"},
      {offset: 0.3, color: "#67BDAF"},
      {offset: 0.2, color: "#50C7E0"},
      {offset: 0.1, color: "#264B93"},
      {offset: 0, color: "#14233C"}
    ],
  });

  // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
  const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
    // Apply the Data to the series. Data can be updated dynamically
    dataSeries,
    minimum: 0,   // minimum value corresponds to colorMap offset=0
    maximum: 1.0, // maximum value corresponds to colorMap offset=1
    stroke: "White", // Wireframe stroke
    strokeThickness: 1.5,
    drawSkirt: false, // Draws solid wall to zero
    drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME, // Draw mesh as solid, wireframe or solid wireframe
    meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_SOLID_CELLS, // Interpolation mode for cell colors
    meshColorPalette: colorMap,
  });

  sciChart3DSurface.renderableSeries.add(series);

  return sciChart3DSurface;
}

export default defineComponent({
  data() {
    return {
      chartInitializationPromise: undefined,
    };
  },
  mounted() {
    console.log("SciChart3d.vue onMounted");
    this.chartInitializationPromise = initSciChart();
  },
  beforeUnmount() {
    console.log("SciChart3d.vue beforeUnmount");
    this.chartInitializationPromise.then((sciChart3DSurface) => {
      console.log("..deleting SciChart3DSurface");
      sciChart3DSurface.delete()
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
