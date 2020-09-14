import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => (
    <div>Performance demo showing SciChart.js loading 500 series each with 500 points description</div>
);

export const load500By500ExampleInfo: TExampleInfo = {
    title: "Load 500 Series x 500 Points Performance Demo",
    path: "/featuredApps_performanceDemos_Load500By500",
    subtitle: "Performance demo showing SciChart.js loading 500 series each with 500 points",
    description: Description,
    code,
    githubUrl,
};
