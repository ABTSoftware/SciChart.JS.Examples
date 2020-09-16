import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Band Series description</div>;
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Band Chart</strong> or High-Low Fill{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: "JavaScript Band Chart",
    path: "/javascript-band-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
