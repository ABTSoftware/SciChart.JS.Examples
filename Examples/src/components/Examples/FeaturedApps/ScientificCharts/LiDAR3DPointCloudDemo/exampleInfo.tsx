import * as React from "react";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {TExampleInfo} from "../../../../AppRouter/examples";

const Description = () => (
    <div>
        {/* tslint:disable-next-line:max-line-length */}
        Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data from the UK Defra Survey.
    </div>
);
// tslint:disable-next-line:max-line-length
const Subtitle = () => <div>Demonstrating the capability of SciChart.js to create JavaScript 3D Point Cloud charts and visualize LiDAR data from the UK Defra Survey.</div>;

export const lidar3DPointCloudExampleInfo: TExampleInfo = {
    title: "LiDAR 3D Point Cloud of Geospatial Data",
    path: "/featuredApps_scientificCharts_Lidar3DPointCloudDemo",
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
