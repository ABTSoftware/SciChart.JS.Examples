<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="scichart-root" style="width: 600px; height: 400px; margin: auto;"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

async function initSciChart() {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  const dataSeries = new XyDataSeries(wasmContext, { xValues: [1,2,3,4,5], yValues: [8,4,1,4,8] });
  const series = new FastLineRenderableSeries(wasmContext, { dataSeries });
  sciChartSurface.renderableSeries.add(series);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // That's it! You just created your first SciChartSurface!
}

export default defineComponent({
  setup() {
    onMounted(() => {
      console.log("execute onMounted");
      initSciChart();
    });
  },
  name: "scichart2d",
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
