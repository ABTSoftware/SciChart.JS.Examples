import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Donut chart description</div>;

export const donutChartExampleInfo: TExampleInfo = {
    title: "Donut Chart",
    path: "/chart2D_createGaugeCharts_DonutChart",
    subtitle: "Donut Chart subtitle",
    description: Description,
    code,
    githubUrl,
};
