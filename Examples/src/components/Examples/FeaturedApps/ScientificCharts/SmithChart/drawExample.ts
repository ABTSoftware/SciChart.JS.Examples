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
    const axisRange = 1.2;
    sciChartSurface.xAxes.add(
        new SmithChartResistanceAxis(wasmContext, {
            visibleRange: new NumberRange(-axisRange, axisRange),
            axisAlignment: EAxisAlignment.Bottom,
            labelPrecision: 1,
            majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
            minorGridLineStyle: { color: gridColor + "77", strokeThickness: 1 },
            rimLineStyle: { color: appTheme.MutedBlue },
            rimTickLineStyle: { color: appTheme.MutedBlue },
            rimLabelStyle: { color: appTheme.MutedBlue },
        })
    );

    sciChartSurface.yAxes.add(
        new SmithChartReactanceAxis(wasmContext, {
            visibleRange: new NumberRange(-axisRange, axisRange),
            axisAlignment: EAxisAlignment.Left,
            labelPrecision: 1,
            majorGridLineStyle: { color: gridColor, strokeThickness: 2 },
            minorGridLineStyle: { color: gridColor + "77", strokeThickness: 1 },
        })
    );

    const yAdmittanceColor = "#44AAFF";
    const admittanceResistanceAxis = new SmithChartAdmittanceResistanceAxis(wasmContext, {
        visibleRange: new NumberRange(-axisRange, axisRange),
        axisAlignment: EAxisAlignment.Bottom,
        isVisible: false,
        majorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 2 },
        minorGridLineStyle: { color: yAdmittanceColor + "77", strokeThickness: 1 },
    });
    const admittanceReactanceAxis = new SmithChartAdmittanceReactanceAxis(wasmContext, {
        visibleRange: new NumberRange(-axisRange, axisRange),
        axisAlignment: EAxisAlignment.Left,
        isVisible: false,
        majorGridLineStyle: { color: yAdmittanceColor, strokeThickness: 2 },
        minorGridLineStyle: { color: yAdmittanceColor + "77", strokeThickness: 1 },
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

    const alphaHex = (v: number) =>
        Math.round(Math.min(1, Math.max(0, v)) * 255)
            .toString(16)
            .padStart(2, "0");

    const update = (state: SmithState) => {
        markersAdapter.update(state);
        vswrAdapter.update(state);
        chainAdapter.update(state);

        // Grid mode — show/hide impedance and admittance axes
        const zGridActive = state.gridMode === "Z" || state.gridMode === "ZY";
        const yGridActive = state.gridMode === "Y" || state.gridMode === "ZY";
        // Z resistance axis stays visible in all modes so the rim always draws;
        // its R-circles are made transparent when not in Z/ZY mode.
        sciChartSurface.xAxes.get(0).isVisible = true;
        sciChartSurface.yAxes.get(0).isVisible = zGridActive;
        admittanceResistanceAxis.isVisible = yGridActive;
        admittanceReactanceAxis.isVisible = yGridActive;

        // Labels: Z labels in Z or ZY; Y labels only in Y-only mode
        const zLabels = zGridActive;
        const yLabels = state.gridMode === "Y";
        (sciChartSurface.xAxes.get(0) as SmithChartResistanceAxis).drawGridLabels = zLabels;
        admittanceResistanceAxis.drawLabels = yLabels;
        admittanceReactanceAxis.drawLabels = yLabels;

        // Grid opacity — Z circles hidden (transparent) in Y-only mode
        const zMajor = zGridActive ? `${gridColor}${alphaHex(state.zOpacity)}` : "#00000000";
        const zMinor = zGridActive ? `${gridColor}${alphaHex(state.zOpacity * 0.5)}` : "#00000000";
        const yMajor = `${yAdmittanceColor}${alphaHex(state.yOpacity)}`;
        const yMinor = `${yAdmittanceColor}${alphaHex(state.yOpacity * 0.5)}`;
        sciChartSurface.xAxes.get(0).majorGridLineStyle = { color: zMajor, strokeThickness: 2 };
        sciChartSurface.xAxes.get(0).minorGridLineStyle = { color: zMinor, strokeThickness: 1 };
        sciChartSurface.yAxes.get(0).majorGridLineStyle = { color: zMajor, strokeThickness: 2 };
        sciChartSurface.yAxes.get(0).minorGridLineStyle = { color: zMinor, strokeThickness: 1 };
        admittanceResistanceAxis.majorGridLineStyle = { color: yMajor, strokeThickness: 2 };
        admittanceResistanceAxis.minorGridLineStyle = { color: yMinor, strokeThickness: 1 };
        admittanceReactanceAxis.majorGridLineStyle = { color: yMajor, strokeThickness: 2 };
        admittanceReactanceAxis.minorGridLineStyle = { color: yMinor, strokeThickness: 1 };
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
