import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Bubble 3D chart description</div>;

const Subtitle = () => <div>Subtitle</div>;

export const bubble3DChartExampleInfo: TExampleInfo = {
    title: "Bubble 3D Chart",
    path: "/chart3D_basicCharts_Bubble3DChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
