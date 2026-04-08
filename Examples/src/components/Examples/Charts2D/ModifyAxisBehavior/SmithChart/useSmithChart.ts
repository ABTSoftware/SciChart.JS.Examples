import { useReducer } from "react";

export type GammaPoint = { re: number; im: number };

export type Marker = {
    id: string;
    label: string;
    gamma: GammaPoint;
    isChainStart: boolean;
};

export type ComponentType = "seriesL" | "seriesC" | "seriesR" | "shuntL" | "shuntC" | "shuntR" | "TL";

export type ChainStep = {
    id: string;
    type: ComponentType;
    value: number; // SI units (H, F, Ω) or wavelengths for TL
    frequency: number; // Hz at time of adding step
    fromGamma: GammaPoint;
    toGamma: GammaPoint;
    arcPoints: GammaPoint[];
};

export type GridMode = "Z" | "Y" | "ZY";

export type SmithState = {
    markers: Marker[];
    chain: ChainStep[];
    chainStartGamma: GammaPoint | null; // when chain does not start from a marker
    activeMarkerId: string | null;
    frequency: number; // Hz, global for reactive components
    vswr: number;
    vswrShaded: boolean;
    gridMode: GridMode;
    zOpacity: number; // 0–1
    yOpacity: number; // 0–1
    _nextMarkerNum: number;
};

export type SmithAction =
    | { type: "ADD_MARKER"; gamma: GammaPoint }
    | { type: "MOVE_MARKER"; id: string; gamma: GammaPoint }
    | { type: "REMOVE_MARKER"; id: string }
    | { type: "SET_ACTIVE_MARKER"; id: string | null }
    | { type: "SET_CHAIN_START"; gamma: GammaPoint }
    | { type: "PROMOTE_TO_CHAIN_START"; id: string }
    | { type: "ADD_CHAIN_STEP"; step: ChainStep }
    | { type: "UNDO_CHAIN_STEP" }
    | { type: "SET_VSWR"; vswr: number }
    | { type: "SET_VSWR_SHADED"; shaded: boolean }
    | { type: "SET_GRID_MODE"; mode: GridMode }
    | { type: "SET_Z_OPACITY"; opacity: number }
    | { type: "SET_Y_OPACITY"; opacity: number }
    | { type: "SET_FREQUENCY"; frequency: number };

export function initialSmithState(): SmithState {
    return {
        markers: [],
        chain: [],
        chainStartGamma: null,
        activeMarkerId: null,
        frequency: 1e9,
        vswr: 2.0,
        vswrShaded: false,
        gridMode: "Z",
        zOpacity: 1.0,
        yOpacity: 0.7,
        _nextMarkerNum: 1,
    };
}

export function smithReducer(state: SmithState, action: SmithAction): SmithState {
    switch (action.type) {
        case "ADD_MARKER": {
            const num = state._nextMarkerNum;
            const marker: Marker = {
                id: `m-${num}`,
                label: `M${num}`,
                gamma: action.gamma,
                isChainStart: false,
            };
            return {
                ...state,
                markers: [...state.markers, marker],
                activeMarkerId: marker.id,
                _nextMarkerNum: num + 1,
            };
        }
        case "MOVE_MARKER":
            return {
                ...state,
                markers: state.markers.map((m) => (m.id === action.id ? { ...m, gamma: action.gamma } : m)),
                activeMarkerId: action.id,
            };
        case "REMOVE_MARKER": {
            const newMarkers = state.markers.filter((m) => m.id !== action.id);
            const newActive =
                state.activeMarkerId === action.id
                    ? newMarkers[newMarkers.length - 1]?.id ?? null
                    : state.activeMarkerId;
            return { ...state, markers: newMarkers, activeMarkerId: newActive };
        }
        case "SET_ACTIVE_MARKER":
            return { ...state, activeMarkerId: action.id };
        case "PROMOTE_TO_CHAIN_START":
            return {
                ...state,
                markers: state.markers.map((m) => ({
                    ...m,
                    isChainStart: m.id === action.id,
                })),
                chainStartGamma: null,
                chain: [],
            };
        case "SET_CHAIN_START":
            return {
                ...state,
                markers: state.markers.map((m) => ({ ...m, isChainStart: false })),
                chainStartGamma: action.gamma,
                chain: [],
            };
        case "ADD_CHAIN_STEP":
            return { ...state, chain: [...state.chain, action.step] };
        case "UNDO_CHAIN_STEP":
            return { ...state, chain: state.chain.slice(0, -1) };
        case "SET_VSWR":
            return { ...state, vswr: Math.max(1.001, action.vswr) };
        case "SET_VSWR_SHADED":
            return { ...state, vswrShaded: action.shaded };
        case "SET_GRID_MODE":
            return { ...state, gridMode: action.mode };
        case "SET_Z_OPACITY":
            return { ...state, zOpacity: Math.min(1, Math.max(0, action.opacity)) };
        case "SET_Y_OPACITY":
            return { ...state, yOpacity: Math.min(1, Math.max(0, action.opacity)) };
        case "SET_FREQUENCY":
            return { ...state, frequency: action.frequency };
        default:
            return state;
    }
}

export function useSmithChart() {
    return useReducer(smithReducer, undefined, initialSmithState);
}
