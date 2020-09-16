import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Band Series description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: "Band Series Chart",
    path: "/chart2D_basicCharts_BandSeriesChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
