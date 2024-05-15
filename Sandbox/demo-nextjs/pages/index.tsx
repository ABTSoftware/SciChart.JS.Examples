"use client";

import Head from "next/head";
import { useEffect, useRef } from "react";
import {
  SciChart3DSurface,
  SciChartSurface,
  ESeriesType,
  chartBuilder,
} from "scichart";

async function initSciChart(rootElement: string | HTMLDivElement) {
  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(
    rootElement,
    {
      series: {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [1, 2, 3, 4],
          yValues: [1, 4, 2, 6],
        },
      },
      // That's it! You just created your first SciChartSurface!
    }
  );

  return { sciChartSurface };
}

export default function Home() {
  const rootElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPromise = initSciChart(rootElementRef.current as HTMLDivElement);

    return () => {
      initPromise.then(({ sciChartSurface }) => sciChartSurface.delete());
    };
  }, []);

  return (
    <div className="container">
      <Head>
        <title> SciChart NextJS Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">SciChart NextJS Example</h1>

        {/* root element for the chart */}
        <div ref={rootElementRef} style={{ width: 600, height: 400 }}></div>
      </main>
    </div>
  );
}
