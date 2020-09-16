import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Bubble chart description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const bubbleChartExampleInfo: TExampleInfo = {
    title: "Bubble Chart",
    path: "/chart2D_basicCharts_BubbleChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
