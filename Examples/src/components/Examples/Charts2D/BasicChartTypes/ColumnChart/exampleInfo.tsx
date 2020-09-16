import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Column chart description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const columnChartExampleInfo: TExampleInfo = {
    title: "Column Chart",
    path: "/chart2D_basicCharts_ColumnChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
