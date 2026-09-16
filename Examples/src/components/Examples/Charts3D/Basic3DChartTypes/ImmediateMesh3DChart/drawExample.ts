import {
    EMainLightMode,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    Vector3,
} from "scichart";
import { appTheme } from "../../../theme";
import { AuroraRibbonSceneEntity } from "./AuroraRibbonSceneEntity";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        worldDimensions: new Vector3(400, 200, 400),
        lighting: {
            ambientLight: 0.18,
            lightMode: EMainLightMode.GlobalSpace,
            lightDirection: new Vector3(-0.25, 0.5, -0.25),
        },
        cameraOptions: {
            position: new Vector3(300, 300, 300),
            target: new Vector3(0, 50, 0),
        },
    });

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(-100, 100) });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(-100, 100) });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { visibleRange: new NumberRange(-100, 100) });

    // An immediate mesh is not a renderable series - it is a custom scene entity added to the root entity
    sciChart3DSurface.rootEntity.children.add(new AuroraRibbonSceneEntity(wasmContext));

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    return { sciChartSurface: sciChart3DSurface, wasmContext };
};
