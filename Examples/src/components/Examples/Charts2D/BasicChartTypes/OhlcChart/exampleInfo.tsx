import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Ohlc chart description</div>;

export const ohlcChartExampleInfo: TExampleInfo = {
    title: "Ohlc Chart",
    path: "/chart2D_basicCharts_OhlcChart",
    subtitle: "Ohlc Chart subtitle",
    description: Description,
    code,
    githubUrl
};
