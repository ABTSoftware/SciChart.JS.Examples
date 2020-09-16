import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Realtime ghosted traces description</div>;
const Subtitle = () => (<p>Demonstrates how create a multi-series <strong>Realtime JavaScript Chart</strong>{' '}
    with glow shader effects using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const realtimeGhostedTracesExampleInfo: TExampleInfo = {
    title: "Realtime Ghosted Traces",
    path: "/javascript-realtime-ghosted-traces-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
