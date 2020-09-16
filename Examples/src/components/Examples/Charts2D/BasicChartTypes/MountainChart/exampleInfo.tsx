import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Mountain chart description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const mountainChartExampleInfo: TExampleInfo = {
    title: "Mountain Chart",
    path: "/chart2D_basicCharts_MountainChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
