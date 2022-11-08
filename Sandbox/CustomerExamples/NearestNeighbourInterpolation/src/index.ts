import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { XyFilterBase } from "scichart/Charting/Model/Filters/XyFilterBase";
import { BaseDataSeries } from "scichart/Charting/Model/BaseDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

class NearestNeighbourFilter extends XyFilterBase {
  constructor(originalSeries: BaseDataSeries) {
    super(originalSeries);
    this.filterAll();
  }

  protected filterAll(): void {
    this.clear();
    const xValues: number[] = [];
    const yValues: number[] = [];

    let prevX = this.getOriginalXValues().get(0);
    xValues.push(prevX);
    yValues.push(this.getOriginalYValues().get(0));
    for (let i = 1; i < this.getOriginalCount(); i++) {
      const nextX = this.getOriginalXValues().get(i);
      xValues.push((nextX + prevX) / 2);
      yValues.push(this.getOriginalYValues().get(i));
      prevX = nextX;
    }
    xValues.push(prevX);
    yValues.push(this.getOriginalYValues().get(this.getOriginalCount() - 1));
    this.appendRange(xValues, yValues);
  }
}

const initSciChart = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  SciChartSurface.useWasmFromCDN();
  SciChartDefaults.performanceWarnings = false;
  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(
    "chart",
    {}
  );
  const dataSeries = new XyDataSeries(wasmContext, {
    xValues: [0, 1, 2, 3, 4, 5, 6],
    yValues: [5, 8, 3, 2, 9, 4, 1]
  });
  const originalSeries = new XyScatterRenderableSeries(wasmContext, {
    dataSeries
  });

  const nearestNeighborLine = new FastLineRenderableSeries(wasmContext, {
    stroke: "red",
    isDigitalLine: true,
    dataSeries: new NearestNeighbourFilter(dataSeries)
  });
  sciChartSurface.renderableSeries.add(originalSeries, nearestNeighborLine);
};

initSciChart();
