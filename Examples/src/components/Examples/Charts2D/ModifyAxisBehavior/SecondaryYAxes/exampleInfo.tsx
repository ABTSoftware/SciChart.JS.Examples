import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Secondary Y axes description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const secondaryYAxesExampleInfo: TExampleInfo = {
    title: "Secondary Y Axes",
    path: "/chart2D_modifyAxisBehavior_SecondaryYAxes",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
