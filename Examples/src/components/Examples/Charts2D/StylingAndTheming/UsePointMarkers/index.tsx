import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import classes from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import customPointImage from "./img/CustomMarkerImage.png";
const emojiUrls =  customPointImage;
// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    return <SciChartReact initChart={drawExample(emojiUrls)} className={classes.ChartWrapper} />;
}
