import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";

const Description = () => <div>Multiple X axes description</div>;

export const multipleXAxesExampleInfo: TExampleInfo = {
    title: "Multiple X Axes",
    path: "/chart2D_modifyAxisBehavior_MultipleXAxes",
    subtitle: "Multiple X Axes subtitle",
    description: Description,
    code,
    githubUrl,
};
