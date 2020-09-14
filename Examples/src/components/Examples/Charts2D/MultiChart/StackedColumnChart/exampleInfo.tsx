import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Stacked column chart description</div>;

export const stackedColumnChartExampleInfo: TExampleInfo = {
    title: "Stacked Column Chart",
    path: "/chart2D_multiChart_StackedColumnChart",
    subtitle: "Stacked Column Chart subtitle",
    description: Description,
    code,
    githubUrl,
};
