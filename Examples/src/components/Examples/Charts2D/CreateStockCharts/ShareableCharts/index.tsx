import * as React from "react";
import { SciChartSurface, FastCandlestickRenderableSeries, SciChartOverview, FastOhlcRenderableSeries } from "scichart";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { drawExample, divOverviewId, divElementId } from "./drawExample";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ShareableChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const [chartMode, setChartMode] = React.useState<string>("pan");

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                sciChartSurfaceRef.current = undefined;
            });
        };
    }, []);

    const handleToggleButtonChanged = (event: any, state: string) => {
        if (state === null) return;
        setChartMode(state);
        if (state === "pan") {
            sciChartSurfaceRef.current.chartModifiers.getById("marker").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("line").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("pan").isEnabled = true;
            sciChartSurfaceRef.current.chartModifiers.getById("cursor").isEnabled = true;
        } else if (state === "line") {
            sciChartSurfaceRef.current.chartModifiers.getById("marker").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("line").isEnabled = true;
            sciChartSurfaceRef.current.chartModifiers.getById("pan").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("cursor").isEnabled = false;
        } else if (state === "marker") {
            sciChartSurfaceRef.current.chartModifiers.getById("marker").isEnabled = true;
            sciChartSurfaceRef.current.chartModifiers.getById("line").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("pan").isEnabled = false;
            sciChartSurfaceRef.current.chartModifiers.getById("cursor").isEnabled = false;
        }
    };

    return (
        <React.Fragment>
            <div className={classes.FullHeightChartWrapper} style={{ background: appTheme.DarkIndigo }}>
                <ToggleButtonGroup
                    style={{ height: "70px", padding: "10" }}
                    exclusive
                    value={chartMode}
                    onChange={handleToggleButtonChanged}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={"pan"} style={{ color: appTheme.ForegroundColor }}>
                        Pan/Cursor
                    </ToggleButton>
                    <ToggleButton value={"line"} style={{ color: appTheme.ForegroundColor }}>
                        Lines
                    </ToggleButton>
                    <ToggleButton value={"marker"} style={{ color: appTheme.ForegroundColor }}>
                        Markers
                    </ToggleButton>
                </ToggleButtonGroup>

                <div id={divElementId} style={{ flexGrow: 1, flexShrink: 1 }} />
            </div>
        </React.Fragment>
    );
}
