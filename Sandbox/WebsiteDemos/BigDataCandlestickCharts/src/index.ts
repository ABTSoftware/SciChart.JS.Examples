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
import Papa = require("papaparse");
import {NumberRange} from "scichart/Core/NumberRange";

const priceDataUrls = ["https://www.cryptodatadownload.com/cdd/Bitstamp_BTCUSD_2017_minute.csv"];

type priceBar = {
  date: number,
  open: number,
  high: number,
  low: number,
  close: number
};

async function loadPriceData(url: string): Promise<priceBar[]> {
  return new Promise<priceBar[]>((resolve, reject) => {
    fetch(url, { mode: "cors" }).then((response) => {
      const priceBars: priceBar[] = [];
      console.log("Fetching... ");
      response.text().then(csv => {
        console.log(`Response Status: ${response.status} about to parse`);
        console.log(csv.length);
        Papa.parse(csv, {
          step: function(row) {
            console.log("Row:", row.data);
          },
          complete: function() {
            console.log("Complete!");
            resolve(priceBars);
          }
        });
      }).catch(reason => reject())
    });
  });
}

async function runExample() {
  const { sciChartSurface, wasmContext } = await initSciChart();
  sciChartSurface.annotations.add(new TextAnnotation({ text: "Loading price data...", x1: 0.5, y1: 0.5, xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative, horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center, fontSize: 20 }));
  const priceBars = await loadPriceData(priceDataUrls[0]);
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
  const xAxis = new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Date_DDMMHHMM });
  const yAxis = new NumericAxis(wasmContext, { labelFormat: ENumericFormat.Decimal, labelPrecision: 2, autoRange: EAutoRange.Always, growBy: new NumberRange(0.1, 0.1) });

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  sciChartSurface.chartModifiers.add(
      new ZoomPanModifier(),
      new ZoomExtentsModifier(),
      new MouseWheelZoomModifier(),
  )

  // That's it! You just created your first SciChartSurface!
  return { sciChartSurface, wasmContext };
}

runExample();
