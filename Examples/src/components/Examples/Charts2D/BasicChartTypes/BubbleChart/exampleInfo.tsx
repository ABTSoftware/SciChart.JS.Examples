import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Bubble chart description</div>;

export const bubbleChartExampleInfo: TExampleInfo = {
    title: "Bubble Chart",
    path: "/chart2D_basicCharts_BubbleChart",
    subtitle:
        "Generates an Bubble-Chart in code. The FastBubbleRenderableSeries can be used to render an XyzDataSeries.",
    description: Description,
    code,
    githubUrl,
};
