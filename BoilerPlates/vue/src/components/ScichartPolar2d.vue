<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="scichart-root-polar" style="width: 600px; height: 400px; margin: auto"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  SciChartPolarSurface,
  SciChartJsNavyTheme,
  PolarNumericAxis,
  NumberRange,
  PolarCategoryAxis,
  PolarMountainRenderableSeries,
  EPolarAxisMode,
  EPolarGridlineMode,
  XyDataSeries
} from 'scichart'

async function initSciChartPolar2D() {
  const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(
    'scichart-root-polar',
    {
      theme: new SciChartJsNavyTheme()
    }
  )

  const angularXAxis = new PolarCategoryAxis(wasmContext, {
    polarAxisMode: EPolarAxisMode.Angular,
    labels: ['Offense', 'Shooting', 'Defense', 'Rebounds', 'Passing', 'Bench'], // categories
    startAngle: Math.PI / 2, // start at 12 o'clock
    flippedCoordinates: true, // go clockwise

    majorGridLineStyle: { color: '#88888844' },
    drawMinorGridLines: false
  })
  sciChartSurface.xAxes.add(angularXAxis)

  const radialYAxis = new PolarNumericAxis(wasmContext, {
    polarAxisMode: EPolarAxisMode.Radial,
    gridlineMode: EPolarGridlineMode.Polygons, // this creates the radar chart look
    visibleRange: new NumberRange(0, 10),
    startAngle: Math.PI / 2, // start at 12 o'clock

    labelPrecision: 0,
    majorGridLineStyle: { color: '#88888844' },
    drawMinorGridLines: false,
    drawMajorTickLines: false,
    drawMinorTickLines: false
  })
  sciChartSurface.yAxes.add(radialYAxis)

  const xValues = [0, 1, 2, 3, 4, 5]
  const yValues = [9, 10, 7, 5, 8, 6] // values for: "Offense", "Shooting", "Defense", "Rebounds", "Passing", "Bench"

  // Radar / Spider Charts may also work with `PolarLineRenderableSeries`
  const polarMountain = new PolarMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, {
      xValues: [...xValues, xValues[xValues.length] + 1], // + 1 to close the loop
      yValues: [...yValues, yValues[0]], // re-plot first point to close the loop
      dataSeriesName: 'Golden State Warriors'
    }),
    stroke: '#FFC72C', // Golden State Warriors gold
    fill: '#1D428A80', // Golden State Warriors blue with 50% opacity
    strokeThickness: 4
  })
  sciChartSurface.renderableSeries.add(polarMountain)
}

export default defineComponent({
  // Best practise in Vue.js is to ensure that sciChartSurface is deleted on component unmount.
  // Here's one way to do this
  data(): { chartInitializationPromise?: Promise<SciChartSurface> } {
    return {
      chartInitializationPromise: undefined
    }
  },
  mounted() {
    console.log('SciChartPolar2d.vue onMounted')
    this.chartInitializationPromise = initSciChartPolar2D()
  },
  beforeUnmount() {
    console.log('SciChartPolar2d.vue beforeUnmount')
    this.chartInitializationPromise!.then((sciChartSurface: SciChartSurface) => {
      console.log('..deleting sciChartSurface')
      sciChartSurface.delete()
    })
  },
  name: 'scichartPolar2d',
  props: {
    msg: String
  }
})
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
