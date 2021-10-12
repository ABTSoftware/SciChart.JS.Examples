import Head from "next/head";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import React from "react";
import { ESeriesType } from "scichart/types/SeriesType";

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart("scichart-root", {
    series: {
      type: ESeriesType.LineSeries, 
      xyData: {
          xValues: [1,2,3,4],
        yValues: [1,4,2,6]
      }
    }
  // That's it! You just created your first SciChartSurface!
  });
}

export default function Home() {
  React.useEffect(() => {
    console.log("testing");
    initSciChart();
  });

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div id="scichart-root" style={{ width: 600, height: 400 }}></div>
      </main>
     
    </div>
  );
}
