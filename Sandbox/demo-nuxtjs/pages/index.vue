<template>
  <div class="mainwrapper">
    <button @click="initSciChart()">Show Sci Chart</button>

    <div
      id="scichart-root"
      style="width: 600px; height: 400px; margin: auto"
      :key="componentKey1"
    />
  </div>
</template>

<script>
export default {
  name: "index",
  mounted() {
    console.log("onMounted");
  },
  methods: {
    async initSciChart() {
      // https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Sandbox/demo-browser-global-module
      SciChart.SciChartSurface.configure({
        dataUrl:
          "https://cdn.jsdelivr.net/npm/scichart@2.0.2115/_wasm/scichart2d.data",
        wasmUrl:
          "https://cdn.jsdelivr.net/npm/scichart@2.0.2115/_wasm/scichart2d.wasm",
      });

      // Create the SciChartSurface in the div 'scichart-root'
      // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
      // instance must be passed to other types that exist on the same surface.
      const { sciChartSurface, wasmContext } =
        await SciChart.SciChartSurface.create("scichart-root");

      const {
        NumericAxis,
        XyDataSeries,
        ZoomExtentsModifier,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        RolloverModifier,
        FastLineRenderableSeries,
      } = SciChart;
      
      // Create an X,Y Axis and add to the chart
      const xAxis = new NumericAxis(wasmContext);
      const yAxis = new NumericAxis(wasmContext);
      sciChartSurface.xAxes.add(xAxis);
      sciChartSurface.yAxes.add(yAxis);

      // Declare a DataSeries
      const xyDataSeries = new XyDataSeries(wasmContext);

      function getRandonInt(max) {
        return Math.floor(Math.random() * max);
      }
      const xValues = [];
      const yValues = [];

      for (let index = 0; index < 100; index++) {
        xValues.push(index);
        yValues.push(getRandonInt(50));
      }

      xyDataSeries.appendRange(xValues, yValues);

      // Add Chart Modifiers
      sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new RolloverModifier({ rolloverLineStroke: "rgba(255,0,0,1)" })
      );

      // Add a line series to the SciChartSurface
      const lineSeries = new FastLineRenderableSeries(wasmContext);
      lineSeries.strokeThickness = 3;
      lineSeries.stroke = "rgba(255,0,0,1)";
      lineSeries.dataSeries = xyDataSeries;

      sciChartSurface.renderableSeries.add(lineSeries);
    },
  },
};
</script>
