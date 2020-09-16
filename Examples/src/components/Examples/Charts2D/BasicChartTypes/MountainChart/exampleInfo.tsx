import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Mountain chart description</div>;
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Mountain / Area Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const mountainChartExampleInfo: TExampleInfo = {
    title: "JavaScript Mountain Chart",
    path: "/javascript-mountain-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
