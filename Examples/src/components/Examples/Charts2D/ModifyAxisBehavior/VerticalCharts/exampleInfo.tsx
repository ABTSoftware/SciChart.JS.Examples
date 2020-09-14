import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Vertical charts description</div>;

export const verticalChartsExampleInfo: TExampleInfo = {
    title: "Vertical Charts",
    path: "/chart2D_modifyAxisBehavior_VerticalCharts",
    subtitle: "Vertical Charts subtitle",
    description: Description,
    code,
    githubUrl,
};
