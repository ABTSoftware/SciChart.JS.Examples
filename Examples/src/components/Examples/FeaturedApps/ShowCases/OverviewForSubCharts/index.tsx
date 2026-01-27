import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import * as React from "react";
import { useContext } from "react";
import { SciChartReact, SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { drawExample } from "./drawExample";

export default function DynamicLayout() {
    return <SciChartReact className={commonClasses.ChartWithNestedToolbar} initChart={drawExample}></SciChartReact>;
}
