import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => (
    <div>
        Performance demo showing SciChart.js loading 3 series and updating dynamically to millions of points description
    </div>
);
const Subtitle = () => (<p>Click <strong>Start</strong> to see SciChart.js append 1,000 points to 3 series{' '}
    every 10 milliseconds, for a total of 3 million points!</p>);

export const realtimePerformanceDemoExampleInfo: TExampleInfo = {
    title: "Realtime JavaScript Chart Performance Demo",
    path: "/featuredApps_performanceDemos_RealtimePerformanceDemo",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
