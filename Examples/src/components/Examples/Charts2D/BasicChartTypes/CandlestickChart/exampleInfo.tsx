import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Candlestick chart description</div>;

export const candlestickChartExampleInfo: TExampleInfo = {
    title: "Candlestick Chart",
    path: "/chart2D_basicCharts_CandlestickChart",
    subtitle: "Candlestick Chart subtitle",
    description: Description,
    code,
    githubUrl,
};
