import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Pie chart description</div>;

export const pieChartExampleInfo: TExampleInfo = {
    title: "Pie Chart",
    path: "/chart2D_createGaugeCharts_PieChart",
    subtitle: "Pie Chart subtitle",
    description: Description,
    code,
    githubUrl,
};
