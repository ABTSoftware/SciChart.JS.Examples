import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Band Series description</div>;

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: "Band Series Chart",
    path: "/chart2D_basicCharts_BandSeriesChart",
    subtitle: "Generates a simple Bands Series chart in code.",
    description: Description,
    code,
    githubUrl,
};
