import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";

const Description = () => <div>Vital signs monitor demo description</div>;

export const vitalSignsMonitorDemoExampleInfo: TExampleInfo = {
    title: "Vital Signs Monitor Demo",
    path: "/featuredApps_medicalCharts_VitalSignsMonitorDemo",
    subtitle: "Vital Signs Monitor Demo subtitle",
    description: Description,
    code,
    githubUrl,
};
