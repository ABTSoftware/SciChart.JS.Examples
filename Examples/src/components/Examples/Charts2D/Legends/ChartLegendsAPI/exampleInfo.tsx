import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Chart legends API description</div>;

export const chartLegendsAPIExampleInfo: TExampleInfo = {
    title: "Chart Legends API",
    path: "/chart2D_legends_ChartLegendsAPI",
    subtitle: "Chart Legends API subtitle",
    description: Description,
    code,
    githubUrl,
};
