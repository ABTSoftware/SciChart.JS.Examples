import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Realtime ticking stock charts description</div>;
const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Stock Chart</strong>{' '}
    with live real-time ticking and updating, using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: "JavaScript Realtime Ticking Stock Charts",
    path: "/javascript-realtime-ticking-stock-charts",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
