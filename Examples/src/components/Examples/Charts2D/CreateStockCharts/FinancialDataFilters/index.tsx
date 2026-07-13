import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { SciChartReact } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample, TFilterMode } from "./drawExample";

const FILTER_LABELS: Array<{ mode: TFilterMode; label: string }> = [
    { mode: "source", label: "No Filter" },
    { mode: "heikinAshi", label: "Heikin-Ashi" },
    { mode: "renko", label: "Renko" },
    { mode: "pointAndFigure", label: "Point & Figure" },
];

export default function FinancialDataFilters() {
    const [filterMode, setFilterMode] = React.useState<TFilterMode>("source");
    const chartApiRef = React.useRef<Awaited<ReturnType<typeof drawExample>> | undefined>(undefined);

    React.useEffect(() => {
        chartApiRef.current?.setFilterMode(filterMode);
    }, [filterMode]);

    return (
        <div className={commonClasses.ChartWrapper} style={{ position: "relative", width: "100%", height: "100%" }}>
            <div style={{ position: "absolute", zIndex: 1, top: 10, left: 12 }}>
                <ButtonGroup size="small" variant="contained">
                    {FILTER_LABELS.map(({ mode, label }) => (
                        <Button
                            key={mode}
                            color={filterMode === mode ? "primary" : "inherit"}
                            onClick={() => setFilterMode(mode)}
                        >
                            {label}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
            <SciChartReact
                style={{ width: "100%", height: "100%" }}
                initChart={async (rootElement) => {
                    const chartApi = await drawExample(rootElement);
                    chartApiRef.current = chartApi;
                    chartApi.setFilterMode(filterMode);
                    return chartApi;
                }}
            />
        </div>
    );
}
