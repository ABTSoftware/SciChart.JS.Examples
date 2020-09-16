import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";

const Description = () => <div>Using rollover modifier tooltips description</div>;

const Subtitle = () => <div>Subtitle</div>;

export const usingRolloverModifierTooltipsExampleInfo: TExampleInfo = {
    title: "Using Rollover Modifier Tooltips",
    path: "/chart2D_tooltipsAndHittest_UsingRolloverModifierTooltips",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
