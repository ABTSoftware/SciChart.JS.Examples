import {
    BaseSceneEntity3D,
    EMainLightMode,
    ESceneEntityType,
    MouseWheelZoomModifier3D,
    NumericAxis3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    TSciChart3D,
    Vector3,
} from "scichart";
import { appTheme } from "../../../theme";

/**
 * The model to load, named by its path inside the asset package. Nothing here is specific to a car -
 * the SciChart 3D engine loads any model you cook into a package (glTF, OBJ, STL, STEP and more).
 */
const modelFileName = "AstonMartin/aston.glb.twi";

/**
 * The asset package holding the model. The engine appends ".web.pkg" and fetches the result, so this
 * may be a bare name served from your site root, or an absolute URL as it is here.
 */
const modelPackage = "https://stagingdemo.scichart.com/fileshare/F1CarAssets";

/**
 * A thin {@link BaseSceneEntity3D} wrapper around the native model entity, so the loaded model can be
 * added to the 3D scene via sciChart3DSurface.rootEntity.children.
 */
class ModelSceneEntity extends BaseSceneEntity3D<any> {
    public readonly type = ESceneEntityType.SCRTSceneEntity;

    constructor(webAssemblyContext: TSciChart3D) {
        super(webAssemblyContext);
        const nativeEntity = new webAssemblyContext.SCRTCADModelSceneEntity(modelFileName, modelPackage);
        // Sizes the model to the 3D world. The package is downloaded in the background and the scene
        // redraws itself once the model is ready.
        nativeEntity.SetModelScale(0.1);
        this.setNativeEntity(nativeEntity);
    }

    /**
     * True once the package has been downloaded and the model is in the scene. The native entity only
     * reports a node hierarchy once it has a model, so an empty hierarchy means "still loading".
     */
    public get isModelLoaded(): boolean {
        try {
            const hierarchyJson = this.nativeEntity.GetNodeHierarchyJson();
            return hierarchyJson ? JSON.parse(hierarchyJson).nodes?.length > 0 : false;
        } catch {
            return false;
        }
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        lighting: {
            ambientLight: 0.25,
            lightMode: EMainLightMode.GlobalSpace,
            lightDirection: new Vector3(-1, -1, -1),
        },
        // Framed so the whole model is in view on startup. Double-click returns the camera here.
        cameraOptions: {
            position: new Vector3(24, 12, 24),
            target: new Vector3(0, 1, 0),
        },
        // Leave only the floor plane, so the model is not boxed in by the axis cube
        xyAxisPlane: { isVisible: false },
        zyAxisPlane: { isVisible: false },
    });

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext);
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext);
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext);

    // A model is not a renderable series - it is a scene entity added to the root entity
    const model = new ModelSceneEntity(wasmContext);
    sciChart3DSurface.rootEntity.children.add(model);

    // A large model can take a while to arrive, so the example shows a loader until it does. The entity
    // has no load event, so poll it. The returned function stops waiting when the chart goes away.
    const waitForModel = (onModelLoaded: () => void) => {
        const intervalId = setInterval(() => {
            if (!model.isModelLoaded) return;
            clearInterval(intervalId);
            // A cached package can arrive before the first render pass, so ask for a redraw once the
            // model is in the scene. Without this the scene stays empty until something else redraws it.
            sciChart3DSurface.invalidateElement();
            onModelLoaded();
        }, 200);
        return () => clearInterval(intervalId);
    };

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    return { sciChartSurface: sciChart3DSurface, wasmContext, waitForModel };
};
