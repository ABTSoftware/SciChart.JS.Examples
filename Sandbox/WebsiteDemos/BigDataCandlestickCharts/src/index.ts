import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {EAutoRange} from "scichart/types/AutoRange";
import {NumberRange} from "scichart/Core/NumberRange";
import csvData from "raw-loader!./Data/Bitstamp_BTCUSD_2017_minute.csv";
import {OhlcDataSeries} from "scichart/Charting/Model/OhlcDataSeries";
import {FastCandlestickRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import {XyMovingAverageFilter} from "scichart/Charting/Model/Filters/XyMovingAverageFilter";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastColumnRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import Papa = require("papaparse");
import {LegendModifier} from "scichart/Charting/ChartModifiers/LegendModifier";
import {SciChartDefaults} from "scichart/Charting/Visuals/SciChartDefaults";
import {CategoryAxis} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/Axis/CategoryAxis";

type priceBar = {
  date: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number,
};

async function loadPriceData(): Promise<priceBar[]> {
  return new Promise<priceBar[]>((resolve, reject) => {
    setTimeout(() => {
      const priceBars: priceBar[] = [];
      let rowCount = 0;
      Papa.parse(csvData, {
        step: function(row) {
          // Skip header rows
          // Row format: Array (9)
          // 0 "1514764740" // Unix timestamp
          // 1 "2017-12-31 23:59:00"
          // 2 "BTC/USD" // Symbol
          // 3 "13913.28" // Open
          // 4 "13913.28" // High
          // 5 "13867.18" // Low
          // 6 "13880.00" // Close
          // 7 "0.59174759" // Volume BTC
          // 8 "8213.4565492" // Volume USD
          if (++rowCount > 2) {
            const rowData = row.data as Array<string>;
            const priceBar = {
                date: Number.parseInt(rowData[0]),
                open: Number.parseFloat(rowData[3]),
                high: Number.parseFloat(rowData[4]),
                low: Number.parseFloat(rowData[5]),
                close: Number.parseFloat(rowData[6]),
                volume: Number.parseFloat(rowData[8])
            };
            if (!Number.isNaN(priceBar.date)) {
              priceBars.push(priceBar);
            }
          }
        },
        complete: function() {
          // CSV Data is in reverse date order
          resolve(priceBars.reverse());
        }
      });
    }, 0);
  });
}

async function runExample() {

  // Create an empty SciChartSurface
  const { sciChartSurface, wasmContext } = await initSciChart();

  // Set loading notification
  sciChartSurface.annotations.add(new TextAnnotation({ text: "Loading price data...", x1: 0.5, y1: 0.5, xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative, horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center, fontSize: 20 }));

  // Load price bars
  const priceBars = await loadPriceData();

  // Set price bars as Candlestick in Scichart
  const ohlcDataSeries = new OhlcDataSeries(wasmContext, {
    dataSeriesName: "Bitcoin/US Dollar",
    xValues: priceBars.map(p => p.date),
    openValues: priceBars.map(p => p.open),
    highValues: priceBars.map(p => p.high),
    lowValues: priceBars.map(p => p.low),
    closeValues: priceBars.map(p => p.close),
  });

  // Add the volume with metadata (Convert Up/Down bar into Green/Red color. This is used later in the paletteprovider)
  const volumeSeries = new XyDataSeries(wasmContext, {
    dataSeriesName: "Volume",
    xValues: priceBars.map(p => p.date),
    yValues: priceBars.map(p => p.volume),
  });
  sciChartSurface.renderableSeries.add(new FastColumnRenderableSeries(wasmContext, { dataSeries: volumeSeries, yAxisId: "volumeYAxis", dataPointWidth: 0.1, strokeThickness: 0 }))

  // Add the candlestick series with highest z-index
  sciChartSurface.renderableSeries.add(new FastCandlestickRenderableSeries(wasmContext, { dataSeries: ohlcDataSeries, resamplingPrecision: 1 }));

  // Add a moving average
  const movingAverage50Data = new XyMovingAverageFilter(ohlcDataSeries, { dataSeriesName: "MA (50)", length: 50 });
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries: movingAverage50Data, stroke: "SteelBlue" }));

  // Add a second moving average
  const movingAverage200Data = new XyMovingAverageFilter(ohlcDataSeries, { dataSeriesName: "MA (200)", length: 200 });
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, { dataSeries: movingAverage200Data, stroke: "Crimson" }));

  // Clear loading notification
  sciChartSurface.annotations.clear();
}


async function initSciChart() {
  // LICENSING //
  // Set your license code here
  // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  //
  // e.g.
  //
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
  //
  // Also, once activated (trial or paid license) having the licensing wizard open on your machine
  // will mean any or all applications you run locally will be fully licensed.

  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new CategoryAxis(wasmContext, { labelFormat: ENumericFormat.Date_DDMMHHMM });
  const yAxis = new NumericAxis(wasmContext, {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 2,
    autoRange: EAutoRange.Always,
    growBy: new NumberRange(0.1, 0.1)
  });

  // Add a hidden YAxis for volume
  const volumeYAxis = new NumericAxis(wasmContext, {
    growBy: new NumberRange(0, 4),
    id: "volumeYAxis",
    isVisible: false,
    autoRange: EAutoRange.Always,
  });

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);
  sciChartSurface.yAxes.add(volumeYAxis);

  // Add some zoom, pan interaction
  sciChartSurface.chartModifiers.add(
      new ZoomPanModifier(),
      new ZoomExtentsModifier(),
      new MouseWheelZoomModifier(),
      new LegendModifier({ showCheckboxes: false, showLegend: true })
  )

  // That's it! You just created your first SciChartSurface!
  return { sciChartSurface, wasmContext };
}

runExample();
