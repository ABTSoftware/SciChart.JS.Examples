import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {DateTimeNumericAxis} from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ENumericFormat} from "scichart/types/NumericFormat";

// You may need this to configure from where wasm and data files are served
// SciChart.SciChartSurface.configure({ dataUrl: "/custom/scichart2d.data" wasmUrl: "/other/scichart2d.wasm" });

// converts dateString in format 'DD MMM YYYY hh:mm:ss' to scichart format
const convertToSciChartFormat = (dateString) => {
  // Date.parse returns number of milliseconds since 1/1/1970
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
  const date = Date.parse(dateString);
  // SciChart dates are unix time format / 1000 for precision reasons
  return date / 1000;
};

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create a Date XAxis
  const xAxis = new DateTimeNumericAxis(wasmContext, {
    labelFormat: ENumericFormat.Date_DDMMYYYY,
  });
  // Create a numeric YAxis
  const yAxis = new NumericAxis(wasmContext);
  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // Given some data in DD MMM YYYY hh:mm:ss format
  const rawData = [
    { date: "01 JAN 2022 22:00:00", value: 178 },
    { date: "01 JAN 2022 23:00:00", value: 132 },
    { date: "02 JAN 2022 00:00:00", value: 165 },
    { date: "02 JAN 2022 01:00:00", value: 172 },
    { date: "02 JAN 2022 02:00:00", value: 189 },
    { date: "02 JAN 2022 03:00:00", value: 180 },
  ];

  // Convert this data to format scichart expects. We do this for performance & precision reasons
  const xValues = rawData.map(row => convertToSciChartFormat(row.date));
  const yValues = rawData.map(row => row.value);

  // Add a series to the chart
  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    strokeThickness: 3,
    stroke: "#50C7E0",
  }));

  // Add some interaction
  sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier());
}

initSciChart();
