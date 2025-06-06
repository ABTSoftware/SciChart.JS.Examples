import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { drawExample } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { makeStyles } from "tss-react/mui";
import { TextLabelProvider, SciChartSurface } from "scichart";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";

const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MultiLineLabels() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>(undefined);
    const labelProviderRef = React.useRef<TextLabelProvider>(undefined);

    const [preset, setPreset] = React.useState<number>(2);

    const handlePreset = (event: any, value: number) => {
        setPreset(value);
        switch (value) {
            case 0:
                labelProviderRef.current.rotation = 0;
                labelProviderRef.current.maxLength = 9;
                break;
            case 1:
                labelProviderRef.current.rotation = 20;
                labelProviderRef.current.maxLength = 0;
                break;
            case 2:
                labelProviderRef.current.rotation = 30;
                labelProviderRef.current.maxLength = 15;
                break;
            default:
                labelProviderRef.current.rotation = 30;
                labelProviderRef.current.maxLength = 15;
                break;
        }
    };

    const { classes } = useStyles();

    return (
        <div className={commonClasses.ChartWrapper} style={{ background: appTheme.DarkIndigo }}>
            <div className={classes.flexOuterContainer}>
                <div className={commonClasses.ToolbarRow}>
                    <ToggleButtonGroup
                        className={commonClasses.ToggleButtonGroup}
                        exclusive
                        value={preset}
                        onChange={handlePreset}
                        size="medium"
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                            Multi-Line
                        </ToggleButton>
                        <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                            Single Line Rotated
                        </ToggleButton>
                        <ToggleButton value={2} style={{ color: appTheme.ForegroundColor }}>
                            Multi-Line Rotated
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <SciChartReact
                    initChart={drawExample}
                    className={classes.chartArea}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { sciChartSurface, labelProvider } = initResult;
                        labelProviderRef.current = labelProvider;
                        sciChartSurfaceRef.current = sciChartSurface;
                    }}
                />
            </div>
        </div>
    );
}
