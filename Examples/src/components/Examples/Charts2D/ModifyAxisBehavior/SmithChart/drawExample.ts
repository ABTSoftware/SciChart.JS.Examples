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
import { SmithChartAdmittanceResistanceAxis, SmithChartAdmittanceReactanceAxis } from "./smithChartAdmittance";
import { SmithMarkersAdapter } from "./smithChartMarkers";
import { SmithVswrAdapter } from "./smithChartVswr";
import { SmithChainAdapter } from "./smithChartChain";
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

    const yAdmittanceColor = "#44AAFF";
    const admittanceResistanceAxis = new SmithChartAdmittanceResistanceAxis(wasmContext, {
        visibleRange: new NumberRange(-1.15, 1.15),
        axisAlignment: EAxisAlignment.Bottom,
        isVisible: false,
        majorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 2 },
        minorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 1 },
    });
    const admittanceReactanceAxis = new SmithChartAdmittanceReactanceAxis(wasmContext, {
        visibleRange: new NumberRange(-1.15, 1.15),
        axisAlignment: EAxisAlignment.Left,
        isVisible: false,
        majorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 2 },
        minorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 1 },
    });
    sciChartSurface.xAxes.add(admittanceResistanceAxis);
    sciChartSurface.yAxes.add(admittanceReactanceAxis);

    // vswrAdapter must be created first so SmithVswrModifier gets priority over SmithClickModifier
    const vswrAdapter = new SmithVswrAdapter(sciChartSurface);
    const markersAdapter = new SmithMarkersAdapter(sciChartSurface, wasmContext);
    const chainAdapter = new SmithChainAdapter(sciChartSurface, wasmContext);

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new PinchZoomModifier(),
        new ZoomPanModifier({ executeCondition: { button: EExecuteOn.MouseRightButton } })
    );

    const update = (state: SmithState) => {
        markersAdapter.update(state);
        vswrAdapter.update(state);
        chainAdapter.update(state);

        // Grid mode — show/hide impedance and admittance axes
        const zVisible = state.gridMode === "Z" || state.gridMode === "ZY";
        const yVisible = state.gridMode === "Y" || state.gridMode === "ZY";
        sciChartSurface.xAxes.get(0).isVisible = zVisible;
        sciChartSurface.yAxes.get(0).isVisible = zVisible;
        admittanceResistanceAxis.isVisible = yVisible;
        admittanceReactanceAxis.isVisible = yVisible;

        // Grid opacity — encode opacity as 2-digit hex suffix on the color
        const alphaHex = (o: number) =>
            Math.round(Math.min(1, Math.max(0, o)) * 255)
                .toString(16)
                .padStart(2, "0");
        const zColor = `#aaaaaa${alphaHex(state.zOpacity)}`;
        const yColor = `#44aaff${alphaHex(state.yOpacity)}`;
        sciChartSurface.xAxes.get(0).majorGridLineStyle = { color: zColor, strokeThickness: 2 };
        sciChartSurface.xAxes.get(0).minorGridLineStyle = { color: zColor, strokeThickness: 1 };
        sciChartSurface.yAxes.get(0).majorGridLineStyle = { color: zColor, strokeThickness: 2 };
        sciChartSurface.yAxes.get(0).minorGridLineStyle = { color: zColor, strokeThickness: 1 };
        admittanceResistanceAxis.majorGridLineStyle = { color: yColor, strokeThickness: 2 };
        admittanceResistanceAxis.minorGridLineStyle = { color: yColor, strokeThickness: 1 };
        admittanceReactanceAxis.majorGridLineStyle = { color: yColor, strokeThickness: 2 };
        admittanceReactanceAxis.minorGridLineStyle = { color: yColor, strokeThickness: 1 };
    };

    const setDispatch = (dispatch: (a: SmithAction) => void) => {
        markersAdapter.setDispatch(dispatch);
        vswrAdapter.setDispatch(dispatch);
        chainAdapter.setDispatch(dispatch);
    };

    return {
        sciChartSurface,
        wasmContext,
        update,
        setDispatch,
        getChainTip: (s: SmithState) => chainAdapter.getChainTip(s),
        addChainStep: chainAdapter.addStep.bind(chainAdapter),
    };
};
