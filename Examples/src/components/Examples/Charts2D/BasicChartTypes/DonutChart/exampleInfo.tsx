import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Donut chart description</div>;
const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Donut Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const donutChartExampleInfo: TExampleInfo = {
    title: "JavaScript Donut Chart",
    path: "/javascript-donut-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
