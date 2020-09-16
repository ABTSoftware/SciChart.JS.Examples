import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Surface mesh 3D chart description</div>;

const Subtitle = () => <div>Subtitle</div>;

export const surfaceMesh3DChartExampleInfo: TExampleInfo = {
    title: "Surface Mesh 3D Chart",
    path: "/chart3D_basicCharts_SurfaceMesh3DChart",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
