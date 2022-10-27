import * as React from "react";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import { CameraController } from "scichart/Charting3D/CameraController";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { PixelPointMarker3D } from "scichart/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import image from "./javascript-3d-lidar-visualization.jpg";
import { EColorMapMode, TLinearColorMap } from "scichart/types/TLinearColorMap";
import { EColor } from "scichart/types/Color";
import { XyzDataSeries3D } from "scichart/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { AscData, AscReader } from "./AscReader";
import { linearColorMapLerp } from "scichart/utils/colorUtil";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";

const divElementId = "chart";

type TMetadata = {
    vertexColorAbgr: number;
    pointScale: number;
};

const drawExample = async () => {
    // Load data from the server
    const dataFromServer = await getDataFromServer();

    // Create a SciChart3DSurface
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // Create and attach a camera to the 3D Viewport
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(300, 300, 300),
        target: new Vector3(0, 50, 0)
    });

    // Add an X,Y,Z axis to the viewport
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    // Create a 3D Scatter series uing pixel point marker, a high performance single pixel applied per x,y,z data-point
    const xyzDataSeries = new XyzDataSeries3D(wasmContext);
    xyzDataSeries.appendRange(
        dataFromServer.ascData.XValues,
        dataFromServer.ascData.YValues,
        dataFromServer.ascData.ZValues,
        dataFromServer.meta
    );

    const pointCloud = new ScatterRenderableSeries3D(wasmContext, {
        pointMarker: new PixelPointMarker3D(wasmContext, { fill: "#00FF00" }),
        dataSeries: xyzDataSeries
    });
    sciChart3DSurface.renderableSeries.add(pointCloud);

    // Add interactivity modifiers for orbiting and zooming with the mousewheel
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

    return { wasmContext, sciChart3DSurface };
};

async function getDataFromServer() {
    // The LinearColorMap type in SciChart allows you to generate a colour map based on a
    // minimum and maximum value, e.g. min=0, max=50 means the gradient brush below is mapped into that range
    //
    const colorMap: TLinearColorMap = {
        Minimum: 0,
        Maximum: 50,
        Mode: EColorMapMode.Interpolated,
        GradientStops: [
            { color: EColor.DodgerBlue, offset: 0 },
            { color: EColor.LimeGreen, offset: 0.2 },
            { color: EColor.Orange, offset: 0.5 },
            { color: EColor.OrangeRed, offset: 0.7 },
            { color: EColor.Purple, offset: 1 }
        ]
    };

    // Read the ASC Lidar data file with optional color map data
    const reader: AscReader = new AscReader(height => {
        // Linearly interpolate each heightValue into a colour and return to the ASCReader
        // This will be injected into the SciChart XyzDataSeries3D to colour points in the point-cloud
        return linearColorMapLerp(colorMap, height);
    });

    const rawData = await fetch("/api/lidardata");
    const ascData: AscData = reader.parse(await rawData.text());

    // Prepare metadata
    const meta: TMetadata[] = ascData.ColorValues.map(c => ({
        vertexColorAbgr: c,
        pointScale: 0
    }));

    return {
        ascData,
        meta
    };
}

export default function LiDAR3DPointCloudDemo() {
    const [loading, setLoading] = React.useState(true);
    const [sciChart3DSurface, setSciChart3DSurface] = React.useState<SciChart3DSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            if (res) {
                setLoading(false);
            }
            setSciChart3DSurface(res.sciChart3DSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChart3DSurface?.delete();
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId}></div>
        </div>
    );
}
