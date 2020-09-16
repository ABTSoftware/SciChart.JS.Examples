import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Stacked column side by side description</div>;
const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Grouped Column Chart</strong>{' '}
    (Stacked columns side-by-side) using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const stackedColumnSideBySideExampleInfo: TExampleInfo = {
    title: "JavaScript Stacked Column Side by Side",
    path: "/javascript-stacked-grouped-column-chart-side-by-side",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
