import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Secondary Y axes description</div>;

export const secondaryYAxesExampleInfo: TExampleInfo = {
    title: "Secondary Y Axes",
    path: "/chart2D_modifyAxisBehavior_SecondaryYAxes",
    subtitle: "Secondary Y Axes subtitle",
    description: Description,
    code,
    githubUrl,
};
