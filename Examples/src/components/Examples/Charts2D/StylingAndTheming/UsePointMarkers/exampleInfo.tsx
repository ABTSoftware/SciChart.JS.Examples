import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Use point markers description</div>;

export const usePointMarkersExampleInfo: TExampleInfo = {
    title: "Use Point Markers",
    path: "/chart2D_stylingAndTheming_UsePointMarkers",
    subtitle: "Use Point Markers subtitle",
    description: Description,
    code,
    githubUrl,
};
