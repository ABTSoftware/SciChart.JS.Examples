import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => <div>Chart legends API description</div>;
const Subtitle = () => (<p>Demonstrates how add a legend to a <strong>JavaScript Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const chartLegendsAPIExampleInfo: TExampleInfo = {
    title: "Chart Legends API",
    path: "/javascript-chart-legends",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
