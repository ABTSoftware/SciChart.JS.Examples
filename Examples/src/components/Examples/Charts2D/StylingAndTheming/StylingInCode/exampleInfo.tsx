import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => (
    <div>
        <p>
            <b>Bold Text</b>
        </p>
        <p>
            <i>Italic text</i>
        </p>
        <p>
            Link: <a href="https://www.scichart.com/">scichart.com</a>
        </p>
        <ul>
            <li>Chart 1</li>
            <li>Chart 2</li>
            <li>Chart 3</li>
        </ul>
    </div>
);

export const stylingInCodeExampleInfo: TExampleInfo = {
    title: "Styling a JavaScript Chart in Code",
    path: "/chart2D_stylingAndTheming_StylingInCode",
    subtitle: "Demonstrates how to style and color the chart parts in SciChart.js in JavaScript code.",
    description: Description,
    code,
    githubUrl,
};
