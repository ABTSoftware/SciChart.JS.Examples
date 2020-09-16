import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Realtime ghosted traces description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const realtimeGhostedTracesExampleInfo: TExampleInfo = {
    title: "Realtime Ghosted Traces",
    path: "/chart2D_createRealtimeCharts_RealtimeGhostedTraces",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
