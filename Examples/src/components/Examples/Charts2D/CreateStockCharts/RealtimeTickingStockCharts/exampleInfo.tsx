import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Realtime ticking stock charts description</div>;
const Subtitle = () => <div>Subtitle</div>;

export const realtimeTickingStockChartsExampleInfo: TExampleInfo = {
    title: "Realtime Ticking Stock Charts",
    path: "/chart2D_createStockCharts_RealtimeTickingStockCharts",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
