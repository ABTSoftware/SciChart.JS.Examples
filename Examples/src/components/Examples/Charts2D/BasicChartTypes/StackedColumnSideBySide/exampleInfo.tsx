import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => <div>Stacked column side by side description</div>;
const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Grouped Column Chart</strong>{' '}
    (Stacked columns side-by-side) using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const stackedColumnSideBySideExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleGroupedColumnChart,
    path: ExampleStrings.urlGroupedColumnChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
