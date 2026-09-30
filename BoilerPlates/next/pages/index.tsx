"use client";

import Head from "next/head";
import { useEffect, useRef } from "react";
import {
  SciChartSurface,
  ESeriesType,
  build2DChart,
  registerAllTypes,
} from "scichart";

// The v6 Builder API is lean by default - it only knows the types that have been
// registered. This example names its types as enums/strings, so register them all.
registerAllTypes();

// Make sure the proper configurations are applied on the client side !

// An example of WASM dependencies URLs configuration to fetch from origin server.
// As of v6 a single wasm binary covers both 2D and 3D charts, and the nosimd /
// 64-bit variants are derived from this url, so one entry is enough:
SciChartSurface.configure({
  wasmUrl: "scichart.wasm",
});
////

// Alternatively WASM files could be fetched from CDN instead:
// SciChartSurface.loadWasmFromCDN()

async function initSciChart(rootElement: string | HTMLDivElement) {
  const { sciChartSurface, wasmContext } = await build2DChart(rootElement, {
    series: {
      type: ESeriesType.LineSeries,
      xyData: {
        xValues: [1, 2, 3, 4],
        yValues: [1, 4, 2, 6],
      },
    },
    // That's it! You just created your first SciChartSurface!
  });

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
