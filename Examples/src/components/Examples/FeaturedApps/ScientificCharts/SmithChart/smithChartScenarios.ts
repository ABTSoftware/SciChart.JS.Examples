import { SmithAction, GammaPoint, ComponentType } from "./useSmithChart";

export type ScenarioStep = {
    description: string;
    run: (
        dispatch: (a: SmithAction) => void,
        addChainStep: (from: GammaPoint, type: ComponentType, value: number, freq: number) => void
    ) => void;
};

export type Scenario = {
    id: string;
    title: string;
    summary: string;
    steps: ScenarioStep[];
};

export const SCENARIOS: Scenario[] = [
    {
        id: "tl-analysis",
        title: "Transmission Line Analysis",
        summary: "How impedance transforms along a lossless 50\u03a9 line.",
        steps: [
            {
                description:
                    "Place load Z\u2097 = 100+j50 \u03a9 (\u0393 = 0.4+j0.2). " +
                    "The marker sits in the upper-right \u2014 a 2:1 inductive mismatch. " +
                    "The VSWR circle is set to match |\u0393| to show the rotation arc.",
                run: (dispatch) => {
                    dispatch({ type: "SET_FREQUENCY", frequency: 1e9 });
                    dispatch({ type: "ADD_MARKER", gamma: { re: 0.4, im: 0.2 } });
                    dispatch({ type: "SET_VSWR", vswr: 2.618 });
                },
            },
            {
                description:
                    "Add a 0.15\u03bb lossless transmission line. The impedance rotates " +
                    "clockwise around the chart centre on the constant-|\u0393| circle \u2014 " +
                    "this is the fundamental transmission-line rule.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: 0.4, im: 0.2 }, "TL", 0.15, 1e9);
                },
            },
            {
                description:
                    "Marker M2 is placed at the new impedance point (\u0393 \u2248 0.07\u2212j0.44). " +
                    "Expand M2 to read Z, VSWR and WTG. The WTG value (outer rim) " +
                    "confirms the 0.15\u03bb rotation toward the generator.",
                run: (dispatch) => {
                    dispatch({ type: "ADD_MARKER", gamma: { re: 0.0667, im: -0.4422 } });
                },
            },
        ],
    },
    {
        id: "single-stub",
        title: "Single-Stub Matching",
        summary: "Match a resistive mismatch using a shunt stub.",
        steps: [
            {
                description:
                    "Place load Z\u2097 = 100+j0 \u03a9 \u2014 purely resistive 2:1 mismatch (\u0393 = 0.333+j0). " +
                    "The marker is on the positive real axis.",
                run: (dispatch) => {
                    dispatch({ type: "SET_FREQUENCY", frequency: 2.4e9 });
                    dispatch({ type: "ADD_MARKER", gamma: { re: 0.3333, im: 0 } });
                },
            },
            {
                description:
                    "Add a 0.152\u03bb transmission line. This rotates the point clockwise " +
                    "to land on the g=1 conductance circle (seen in Y or ZY view). " +
                    "Any point on g=1 can be matched with a single shunt element.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: 0.3333, im: 0 }, "TL", 0.152, 2.4e9);
                },
            },
            {
                description:
                    "Add a 4.7 nH shunt inductor. Its negative susceptance cancels the " +
                    "remaining positive susceptance at the g=1 point. The arc drops to " +
                    "the chart centre: \u0393\u22480, perfect 50\u03a9 match.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: -0.1109, im: -0.3143 }, "shuntL", 4.7e-9, 2.4e9);
                },
            },
        ],
    },
    {
        id: "l-network",
        title: "L-Network Matching",
        summary: "Match a low-impedance PA load at 900 MHz.",
        steps: [
            {
                description:
                    "Place Z\u2097 = 10+j15 \u03a9 \u2014 typical handset PA output at 900 MHz " +
                    "(\u0393 \u2248 \u22120.57+j0.39, VSWR \u2248 4.5). The marker is deep in the left half.",
                run: (dispatch) => {
                    dispatch({ type: "SET_FREQUENCY", frequency: 900e6 });
                    dispatch({ type: "ADD_MARKER", gamma: { re: -0.569, im: 0.392 } });
                },
            },
            {
                description:
                    "Add a 0.884 nH series inductor. This moves the point UP along the " +
                    "constant-R=0.2 circle (increasing reactance) until it reaches the g=1 " +
                    "conductance circle. Series components move along constant-R arcs.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: -0.569, im: 0.392 }, "seriesL", 0.884e-9, 900e6);
                },
            },
            {
                description:
                    "Add a 7.07 pF shunt capacitor. Its positive susceptance cancels the " +
                    "inductive susceptance at the g=1 point. The arc swings into the " +
                    "chart centre: \u0393\u22480. Match complete with two components.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: -0.5, im: 0.5 }, "shuntC", 7.07e-12, 900e6);
                },
            },
        ],
    },
    {
        id: "antenna-2g4",
        title: "2.4 GHz Antenna Match",
        summary: "Match a PCB antenna that sits just outside VSWR=2.",
        steps: [
            {
                description:
                    "Place measured antenna impedance Z\u2097 = 25\u2212j25 \u03a9 (\u0393 = \u22120.2\u2212j0.4). " +
                    "VSWR \u2248 2.6 \u2014 outside the shaded VSWR=2 acceptance circle. " +
                    "The goal is to bring it inside.",
                run: (dispatch) => {
                    dispatch({ type: "SET_FREQUENCY", frequency: 2.4e9 });
                    dispatch({ type: "ADD_MARKER", gamma: { re: -0.2, im: -0.4 } });
                    dispatch({ type: "SET_VSWR", vswr: 2.0 });
                    dispatch({ type: "SET_VSWR_SHADED", shaded: true });
                },
            },
            {
                description:
                    "Add a 3.32 nH series inductor. The antenna impedance has capacitive " +
                    "reactance; the inductor cancels it and moves the point up the " +
                    "constant-R=0.5 circle to the g=1 conductance circle.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: -0.2, im: -0.4 }, "seriesL", 3.32e-9, 2.4e9);
                },
            },
            {
                description:
                    "Add a 1.33 pF shunt capacitor. The arc swings into the chart centre, " +
                    "well inside the VSWR=2 circle. The antenna is now matched to 50\u03a9 " +
                    "with just two components: a 3.32 nH series inductor and a 1.33 pF shunt capacitor.",
                run: (_dispatch, addChainStep) => {
                    addChainStep({ re: -0.2, im: 0.4 }, "shuntC", 1.33e-12, 2.4e9);
                },
            },
        ],
    },
];
