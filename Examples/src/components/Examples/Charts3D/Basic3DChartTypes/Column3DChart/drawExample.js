import {
    SciChart3DSurface,
    CameraController,
    Vector3,
    EWatermarkPosition,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    NumericAxis3D,
    XyzDataSeries3D,
    parseColorToTArgb,
    CubePointMarker3D,
    PyramidPointMarker3D,
    SpherePointMarker3D,
    CylinderPointMarker3D,
    ColumnRenderableSeries3D,
    toHex,
    parseColorToUIntArgb,
} from "scichart";
import { appTheme } from "../../../theme";
export var EColumn3DType;
(function (EColumn3DType) {
    EColumn3DType["CylinderPointMarker3D"] = "Cylinder";
    EColumn3DType["CubePointMarker3D"] = "Cube";
    EColumn3DType["PyramidPointMarker3D"] = "Pyramid";
    EColumn3DType["SpherePointMarker3D"] = "Sphere";
})(EColumn3DType || (EColumn3DType = {}));
export var EColumnColorMode;
(function (EColumnColorMode) {
    EColumnColorMode["X"] = "X";
    EColumnColorMode["XZ"] = "XZ";
    EColumnColorMode["Height"] = "Height";
    EColumnColorMode["Series"] = "Series";
})(EColumnColorMode || (EColumnColorMode = {}));
export async function drawExample(divElementId) {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-300, 300, -300),
        target: new Vector3(0, 50, 0),
    });
    sciChart3DSurface.watermarkPosition = EWatermarkPosition.TopLeft;
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    // sciChart3DSurface.chartModifiers.add(new TooltipModifier3D({ showTooltip: true, crosshairStroke: 'green', crosshairStrokeThickness: 2 }));
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });
    const dataSeries = new XyzDataSeries3D(wasmContext);
    // size in the point marker is ignored, use dataPointWidthX and dataPointWidthZ instead!
    const series = new ColumnRenderableSeries3D(wasmContext, {
        dataSeries,
        pointMarker: createPointMarker3D(wasmContext, EColumn3DType.CylinderPointMarker3D, appTheme.VividOrange),
        dataPointWidthX: 0.9,
        dataPointWidthZ: 0.9,
        useMetadataColors: true,
    });
    const updateData = (colorMode, update) => {
        const startX = 0;
        const stepX = 1;
        const countX = 10;
        const startZ = 0;
        const stepZ = 1;
        const countZ = 30;
        const minY = 0;
        const maxY = 40;
        const startColor = parseColorToTArgb(appTheme.VividTeal);
        const endColor = parseColorToTArgb(appTheme.VividPink);
        let i = 0;
        for (let xIndex = 0; xIndex < countX; xIndex++) {
            const x = startX + xIndex * stepX;
            for (let zIndex = 0; zIndex < countZ; zIndex++) {
                const z = startZ + zIndex * stepZ;
                let y;
                if (update) {
                    y = dataSeries.getNativeYValues().get(i);
                } else {
                    y = Math.random() * maxY * (x / (2 * countX) + 0.5);
                }
                let vertexColor;
                let c;
                let cmax;
                if (colorMode === EColumnColorMode.Height) {
                    vertexColor = colorInterpolation(startColor, endColor, minY, maxY, y);
                } else if (colorMode === EColumnColorMode.X) {
                    c = x;
                    cmax = countX;
                    vertexColor = parseColorToUIntArgb(appTheme.SciChartJsTheme.getStrokeColor(c, cmax, wasmContext));
                } else if (colorMode === EColumnColorMode.XZ) {
                    c = x * z;
                    cmax = countX * countZ;
                    vertexColor = parseColorToUIntArgb(appTheme.SciChartJsTheme.getStrokeColor(c, cmax, wasmContext));
                }
                series.useMetadataColors = colorMode !== EColumnColorMode.Series;
                if (update) {
                    dataSeries.update(i, x, y, z, { vertexColor, pointScale: 1 });
                } else {
                    dataSeries.append(x, y, z, { vertexColor, pointScale: 1 });
                }
                i += 1;
            }
        }
    };
    sciChart3DSurface.renderableSeries.add(series);
    updateData(EColumnColorMode.X, false);
    const updateColors = (colorMode) => {
        updateData(colorMode, true);
    };
    const updatePointMarker = (type) => {
        series.pointMarker = createPointMarker3D(wasmContext, type, appTheme.VividOrange);
    };
    return { sciChartSurface: sciChart3DSurface, controls: { updateColors, updatePointMarker } };
}
export function createPointMarker3D(wasmContext, type, fill) {
    switch (type) {
        case EColumn3DType.CubePointMarker3D:
            return new CubePointMarker3D(wasmContext, { fill });
        case EColumn3DType.PyramidPointMarker3D:
            return new PyramidPointMarker3D(wasmContext, { fill });
        case EColumn3DType.SpherePointMarker3D:
            return new SpherePointMarker3D(wasmContext, { fill });
        default:
            return new CylinderPointMarker3D(wasmContext, { fill });
    }
}
export function colorInterpolation(startColor, endColor, startY, endY, currentY) {
    const redValue = Math.floor(lerpFn(startY, endY, startColor.red, endColor.red, currentY));
    const greenValue = Math.floor(lerpFn(startY, endY, startColor.green, endColor.green, currentY));
    const blueValue = Math.floor(lerpFn(startY, endY, startColor.blue, endColor.blue, currentY));
    const hexStr = "0x" + toHex(255) + toHex(redValue) + toHex(greenValue) + toHex(blueValue);
    return parseInt(hexStr, 16);
}
function lerpFn(minY, maxY, minColor, maxColor, v) {
    return minColor + ((v - minY) * (maxColor - minColor)) / (maxY - minY);
}
