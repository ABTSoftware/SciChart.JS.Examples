import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Line chart description</div>;

export const lineChartExampleInfo: TExampleInfo = {
    title: "Line Chart",
    path: "/chart2D_basicCharts_LineChart",
    subtitle: "Line Chart subtitle",
    description: Description,
    code,
    githubUrl
};
