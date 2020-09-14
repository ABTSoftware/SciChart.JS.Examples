import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Multi-pane stock charts description</div>;

export const multiPaneStockChartsExampleInfo: TExampleInfo = {
    title: "Multi-Pane Stock Charts",
    path: "/chart2D_createStockCharts_MultiPaneStockCharts",
    subtitle: "Multi-Pane Stock Charts subtitle",
    description: Description,
    code,
    githubUrl,
};
