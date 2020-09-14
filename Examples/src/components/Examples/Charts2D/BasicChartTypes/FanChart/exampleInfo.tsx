import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Fan chart description</div>;

export const fanChartExampleInfo: TExampleInfo = {
    title: "Fan Chart",
    path: "/chart2D_basicCharts_FanChart",
    subtitle: "Generates a simple Fan chart in code.",
    description: Description,
    code,
    githubUrl,
};
