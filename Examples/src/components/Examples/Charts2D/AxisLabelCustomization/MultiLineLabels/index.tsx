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
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 0,
        width: "100%",
        color: appTheme.ForegroundColor,
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MultiLineLabels() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const labelProviderRef = React.useRef<TextLabelProvider>();

    const [preset, setPreset] = React.useState<number>(0);

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
                labelProviderRef.current.maxLength = 12;
                break;
            default:
                labelProviderRef.current.rotation = 0;
                labelProviderRef.current.maxLength = 9;
                break;
        }
    };

    const { classes } = useStyles();

    return (
        <>
            <div className={commonClasses.ChartWrapper} style={{ background: appTheme.DarkIndigo }}>
                <SciChartReact
                    initChart={drawExample}
                    className={commonClasses.ChartWrapper}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        const { sciChartSurface, labelProvider } = initResult;
                        labelProviderRef.current = labelProvider;
                        sciChartSurfaceRef.current = sciChartSurface;
                    }}
                />
            </div>
            <div className={classes.flexOuterContainer}>
                <div className={classes.toolbarRow}>
                    <ToggleButtonGroup
                        style={{ height: "100px", padding: "10" }}
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
            </div>
        </>
    );
}
