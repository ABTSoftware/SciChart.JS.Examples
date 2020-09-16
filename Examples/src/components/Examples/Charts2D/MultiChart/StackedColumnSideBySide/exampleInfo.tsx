import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Stacked column side by side description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const stackedColumnSideBySideExampleInfo: TExampleInfo = {
    title: "Stacked Column Side by Side",
    path: "/chart2D_multiChart_StackedColumnSideBySide",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
