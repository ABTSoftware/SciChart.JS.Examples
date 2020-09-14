import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Coloring per point description</div>;

export const perPointColoringExampleInfo: TExampleInfo = {
    title: "Coloring Series per-point using the PaletteProvider",
    path: "/chart2D_stylingAndTheming_ColoringPerPointPaletteProvider",
    subtitle: "Demonstrates how to color various series per-point using the PaletteProvider API",
    description: Description,
    code,
    githubUrl,
};
