import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { makeStyles } from "tss-react/mui";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { useState } from "react";

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
export default function FeatureAxisTypes() {
    const { classes } = useStyles();
    return (
        <div className={commonClasses.ChartWrapper}>
            <SciChartReact className={classes.chartArea} initChart={drawExample} />
        </div>
    );
}
