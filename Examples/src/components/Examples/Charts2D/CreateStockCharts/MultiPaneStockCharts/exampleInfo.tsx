import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Multi-pane stock charts description</div>;
const Subtitle = () => (<p>Demonstrates how create a multi-pane <strong>JavaScript Stock Chart</strong>{' '}
    with indicator panels, synchronized zooming, panning and cursors, using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const multiPaneStockChartsExampleInfo: TExampleInfo = {
    title: "JavaScript Multi-Pane Stock Charts",
    path: "/javascript-multi-pane-stock-charts",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
