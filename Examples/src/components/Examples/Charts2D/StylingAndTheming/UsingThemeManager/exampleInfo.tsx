import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Using theme manager description</div>;

const Subtitle = () => <div>Subtitle</div>;


export const usingThemeManagerExampleInfo: TExampleInfo = {
    title: "Using Theme Manager",
    path: "/chart2D_stylingAndTheming_UsingThemeManager",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
