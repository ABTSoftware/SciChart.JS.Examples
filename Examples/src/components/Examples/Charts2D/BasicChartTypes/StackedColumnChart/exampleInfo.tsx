import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Stacked column chart description</div>;
const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Stacked Column Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const stackedColumnChartExampleInfo: TExampleInfo = {
    title: "JavaScript Stacked Column Chart",
    path: "/javascript-stacked-column-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
