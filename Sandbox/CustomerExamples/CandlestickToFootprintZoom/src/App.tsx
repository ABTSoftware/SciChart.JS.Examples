import { useRef, useState } from "react";
import { SciChartReact } from "scichart-react";
import { SciChartSurface } from "scichart";
import { OrderFlowData } from "./data";
import { createFootprintChart, FootprintChartControls, TIMEFRAMES, ViewInfo } from "./footprintChart";

const DATA_URL = `${import.meta.env.BASE_URL}data/footprint-sample.json`;

SciChartSurface.UseCommunityLicense();
type InitResult = Awaited<ReturnType<typeof createFootprintChart>>;

function App() {
  const controls = useRef<FootprintChartControls>();
  const [tf, setTf] = useState(1);
  const [view, setView] = useState<ViewInfo | null>(null);
  const [candlesInFootprint, setCandlesInFootprint] = useState(true);

  const initChart = async (root: string | HTMLDivElement) => {
    const data = await OrderFlowData.load(DATA_URL);
    return createFootprintChart(root, data, setView);
  };

  const pickTimeframe = (i: number) => {
    setTf(i);
    controls.current?.setTimeframe(i);
  };

  return (
    <div className="app">
      <header className="toolbar">
        <strong>BTC-USD order flow</strong>
        <span className="group">
          {TIMEFRAMES.map((t, i) => (
            <button key={t.label} className={i === tf ? "on" : ""} onClick={() => pickTimeframe(i)}>
              {t.label}
            </button>
          ))}
        </span>
        <button onClick={() => controls.current?.resetZoom()}>Reset zoom</button>
        <label className="switch">
          <input
            type="checkbox"
            checked={candlesInFootprint}
            onChange={(e) => {
              setCandlesInFootprint(e.target.checked);
              controls.current?.setShowCandlesInFootprint(e.target.checked);
            }}
          />
          <span className="track" />
          Candles in footprint
        </label>
        {view && (
          <span className="status">
            <span>
              {view.visibleCandles} {view.mode === "Footprint" ? "footprint" : "candles"}
            </span>
            <span>{view.timeframe} candles visible</span>
            {view.mode === "Footprint" && <span>${view.bucket} price levels</span>}
          </span>
        )}
      </header>
      <p className="hint">
        <span>Scroll to zoom</span>
        <span>Drag to pan</span>
        <span>Double-click to reset</span>
        <span>Zoom in far enough and candles become footprints</span>
        <span>Sells on the left, buys on the right</span>
        <span>Yellow box marks the busiest price</span>
      </p>
      <SciChartReact
        className="chart"
        initChart={initChart}
        onInit={(r: InitResult) => {
          controls.current = r.controls;
        }}
      />
    </div>
  );
}

export default App;
