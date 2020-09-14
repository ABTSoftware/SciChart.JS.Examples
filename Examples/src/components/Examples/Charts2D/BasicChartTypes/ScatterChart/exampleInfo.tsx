import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Scatter chart description</div>;

export const scatterChartExampleInfo: TExampleInfo = {
    title: "Scatter Chart",
    path: "/chart2D_basicCharts_ScatterChart",
    subtitle: "Scatter Chart subtitle",
    description: Description,
    code,
    githubUrl,
};
