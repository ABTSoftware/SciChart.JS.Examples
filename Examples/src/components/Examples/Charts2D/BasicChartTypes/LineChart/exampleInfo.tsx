import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Line chart description</div>;
const Subtitle = () => <div>Woot woot</div>;

export const lineChartExampleInfo: TExampleInfo = {
    title: "JavaScript Line Chart",
    path: "/javascript-line-chart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl
};
