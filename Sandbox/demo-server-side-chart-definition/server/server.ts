import express from "express";
import { ISciChart2DDefinition } from "scichart/Builder/buildSurface";
import { ESeriesType } from "scichart/types/SeriesType";
import Binance, { CandleChartInterval_LT, CandleChartResult } from "binance-api-node";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";

const app = express();
const port = 3000;

app.use(express.static("client"));

app.get("/chart", async (req, res) => {
  const definition: ISciChart2DDefinition = {
    series: {
      type: ESeriesType.LineSeries,
      options: {  },
      xyData: { xValues: [1, 2, 3], yValues: [1, 3, 2] },
    },
  };
  res.send(definition);
});

const binance = Binance();

app.get("/chart/:symbol/:interval", async (req, res) => {
  // get the requested symbol
  const symbol = req.params.symbol;
  const interval = req.params.interval as CandleChartInterval_LT; 
  let candles: CandleChartResult[] = []; 
  // Fetch the data, with some error handling
  try {
     candles = await binance.candles({ symbol, interval });
  } catch (err) {
    res.status(400).send("Invalid Symbol or interval");
    return;
  }
  const xValues: number[] = [];
  const openValues: number[] = [];
  const highValues: number[] = [];
  const lowValues: number[] = [];
  const closeValues: number[] = [];
  // Convert the data to arrays
  for (const candle of candles) {
    // SciChart default date parsing expects times in seconds
    xValues.push(candle.openTime / 1000);
    openValues.push(Number(candle.open));
    highValues.push(Number(candle.high));
    lowValues.push(Number(candle.low));
    closeValues.push(Number(candle.close));
  }
  const definition: ISciChart2DDefinition = {
    series: {
      type: ESeriesType.CandlestickSeries,
      options: {  },
      ohlcData: { xValues, openValues, highValues, lowValues, closeValues }
    },
    // SmartDate labelprovider will give nice date labels, regardless of the range
    xAxes: { type: EAxisType.CategoryAxis, options: { labelProvider: { type: ELabelProviderType.SmartDate } } },
    // Format using significant figures to get sensible labels for very large and very small values
    yAxes: { type: EAxisType.NumericAxis, options: { labelFormat: ENumericFormat.SignificantFigures, labelPrecision: 3 }},
    // Interactivity!
    modifiers: [
      { type: EChart2DModifierType.MouseWheelZoom },
      { type: EChart2DModifierType.ZoomPan },
      { type: EChart2DModifierType.ZoomExtents },
      { type: EChart2DModifierType.Cursor }
    ]
  };
  res.send(definition);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
