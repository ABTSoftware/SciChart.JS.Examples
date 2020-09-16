import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Stacked mountain chart description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const stackedMountainChartExampleInfo: TExampleInfo = {
    title: "Stacked Mountain Chart",
    path: "/chart2D_multiChart_StackedMountainChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
