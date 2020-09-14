import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => (
    <div>
        Performance demo showing SciChart.js loading 3 series and updating dynamically to millions of points description
    </div>
);

export const realtimePerformanceDemoExampleInfo: TExampleInfo = {
    title: "Realtime JavaScript Chart Performance Demo",
    path: "/featuredApps_performanceDemos_RealtimePerformanceDemo",
    subtitle: "Performance demo showing SciChart.js loading 3 series and updating dynamically to millions of points",
    description: Description,
    code,
    githubUrl,
};
