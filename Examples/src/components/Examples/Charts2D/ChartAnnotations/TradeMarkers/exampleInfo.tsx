import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Trading Buy Sell Marker Annotations description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const tradeMarkerAnnotationsExampleInfo: TExampleInfo = {
    title: "Trading Buy Sell Marker Annotations",
    path: "/chart2D_chartAnnotations_TradeBuySellMarkers",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
