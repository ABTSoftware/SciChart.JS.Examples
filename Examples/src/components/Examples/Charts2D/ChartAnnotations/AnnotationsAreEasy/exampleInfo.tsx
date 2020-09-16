import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Annotations are easy description</div>;
const Subtitle = () => (<p>Demonstrates how to add Annotations (shapes, boxes, lines, text){' '}
    to a <strong>JavaScript Chart</strong> using SciChart.js, High Performance{' '}
    <a href="https://www.scichart.com/javascript-chart-features" target="_blank">JavaScript Charts</a></p>);

export const annotationsAreEasyExampleInfo: TExampleInfo = {
    title: "JavaScript Chart Annotations",
    path: "/javascript-chart-annotations",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
