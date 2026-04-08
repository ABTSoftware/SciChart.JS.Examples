import {
    SciChartSurface,
    EAxisAlignment,
    NumberRange,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    PinchZoomModifier,
    ZoomPanModifier,
    EExecuteOn,
} from "scichart";
import { appTheme } from "../../../theme";
import { SmithChartResistanceAxis, SmithChartReactanceAxis } from "./smithChartAxes";
import { SmithMarkersAdapter } from "./smithChartMarkers";
import { SmithState, SmithAction } from "./useSmithChart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const gridColor = "#aaaaaa";

    sciChartSurface.xAxes.add(
        new SmithChartResistanceAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Bottom,
            majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
            minorGridLineStyle: { color: gridColor, strokeThickness: 1 },
        })
    );

    sciChartSurface.yAxes.add(
        new SmithChartReactanceAxis(wasmContext, {
            visibleRange: new NumberRange(-1.15, 1.15),
            axisAlignment: EAxisAlignment.Left,
            majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
            minorGridLineStyle: { color: gridColor, strokeThickness: 1 },
        })
    );

    const markersAdapter = new SmithMarkersAdapter(sciChartSurface, wasmContext);

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new PinchZoomModifier(),
        new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );

    const update = (state: SmithState) => {
        markersAdapter.update(state);
    };

    const setDispatch = (dispatch: (a: SmithAction) => void) => {
        markersAdapter.setDispatch(dispatch);
    };

    return { sciChartSurface, wasmContext, update, setDispatch };
};
