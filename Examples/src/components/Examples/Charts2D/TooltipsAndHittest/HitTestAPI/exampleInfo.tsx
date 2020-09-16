import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => (
    <div>
        Demonstrates the Hit Test API, which can be used to get feedback about clicks on data-points or lines and enable
        selection, of showing of context menus. Click on the data-point and see hit test info on the right.
    </div>
);

const Subtitle = () => <div>Subtitle</div>;


export const hitTestApiExampleInfo: TExampleInfo = {
    title: "Hit-Test API",
    path: "/chart2D_tooltipsAndHittest_HitTestApi",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
