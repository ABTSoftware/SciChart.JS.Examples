import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => <div>Ohlc chart description</div>;

const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript Ohlc Chart</strong> or Stock Chart{' '}
    using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const ohlcChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleOhlcChart,
    path: ExampleStrings.urlOhlcChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl
};
