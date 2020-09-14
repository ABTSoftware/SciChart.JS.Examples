import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Realtime ticking stock charts description</div>;

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: "Realtime Ticking Stock Charts",
    path: "/chart2D_createStockCharts_RealtimeTickingStockCharts",
    subtitle: "Realtime Ticking Stock Charts subtitle",
    description: Description,
    code,
    githubUrl,
};
