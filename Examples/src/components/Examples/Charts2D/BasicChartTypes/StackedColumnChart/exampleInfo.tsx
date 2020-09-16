import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => <div>Stacked column chart description</div>;
const Subtitle = () => (<p>Demonstrates how create a <strong>JavaScript Stacked Column Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);

export const stackedColumnChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleStackedColumnChart,
    path: ExampleStrings.urlStackedColumnChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
