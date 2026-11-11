# Candlestick to Footprint Zoom

A SciChart.js candlestick chart (React + Vite) that turns into a footprint chart as you zoom in.

Once candles are big enough on screen, each one shows its sell volume on the left, buy volume on the right and a yellow
box on its busiest price. Zoom in further and the volume numbers appear too.

```bash
npm install
npm run dev
```

## Files

- `src/footprintChart.ts` sets up the chart and switches between candles and footprints.
- `src/data.ts` loads the sample and builds candles and footprint cells for any timeframe.
- `src/utils.ts` holds small helpers (colours, date format, rounding).
- `src/App.tsx` is the toolbar around the chart.

The footprint is plain SciChart series: `FastRectangleRenderableSeries` for the bars (a palette provider gives each bar
its own colour) and for the yellow boxes, plus `FastTextRenderableSeries` for the numbers.

## Data

`public/data/footprint-sample.json` is 2 hours of **synthetic** BTC-USD data: 15s candles, plus buy and sell volume
for every 15s and $1 price level. To use your own, provide the same two tables. In a real app you'd usually build the
footprint cells on your server.
