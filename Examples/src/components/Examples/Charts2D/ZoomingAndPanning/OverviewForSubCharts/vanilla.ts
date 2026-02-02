import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

/**
 * Creates charts on the provided root elements
 * @returns cleanup function
 */
const create = async () => {
    const { sciChartSurface } = await drawExample("chart", [
        { id: "subchart-0", phase: 0, color: appTheme.MutedBlue, title: "Pane 1" },
        { id: "subchart-1", phase: 0.7, color: appTheme.MutedOrange, title: "Pane 2" },
        { id: "subchart-2", phase: 1.4, color: appTheme.MutedPink, title: "Pane 3" },
        { id: "subchart-3", phase: 2.1, color: appTheme.MutedPurple, title: "Pane 4" },
    ]);

    const destructor = () => {
        sciChartSurface.delete();
    };

    return destructor;
};

create();

// call the `destructor` returned by the `create` promise to dispose the charts when necessary
