import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Coloring per point description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const perPointColoringExampleInfo: TExampleInfo = {
    title: "Coloring Series per-point using the PaletteProvider",
    path: "/chart2D_stylingAndTheming_ColoringPerPointPaletteProvider",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
