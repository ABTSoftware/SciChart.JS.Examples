import React from "react";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";

async function initSciChart() {
  console.log("build Chart");
  const definition = await fetch("/chart/BTCUSDT").then(response => response.json());
  return await chartBuilder.build2DChart("scichart-root", definition);
}

function Chart2() {
  const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

  React.useEffect(() => {
      (async () => {
          const res = await initSciChart();
          setSciChartSurface(res.sciChartSurface);
          // @ts-ignore
          console.log(await performance.measureUserAgentSpecificMemory().then(m => m.bytes / 1000000));
      })();
      // Deleting sciChartSurface to prevent memory leak
      return () => {
        console.log("delete");
        sciChartSurface?.delete();
      }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chart 2</h1>
      </header>
      <div id="scichart-root" style={{ maxWidth: 900 }} />
    </div>
  );
}

export default Chart2;
