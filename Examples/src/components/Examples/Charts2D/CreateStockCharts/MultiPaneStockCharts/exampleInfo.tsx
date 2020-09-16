import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Multi-pane stock charts description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const multiPaneStockChartsExampleInfo: TExampleInfo = {
    title: "Multi-Pane Stock Charts",
    path: "/chart2D_createStockCharts_MultiPaneStockCharts",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
