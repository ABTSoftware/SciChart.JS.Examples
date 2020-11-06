import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

export type TFooterlink = {
    link: string;
    text: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        overflow: "hidden",
        backgroundColor: "#4caf50EE",
        color: "white",
        fontFamily:
            "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
    },
    link1: {
        color: "white",
    },
}));

export default function AppFooter() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            SciChart.js: Fast, Realtime, High Performance{" "}
            <a className={classes.link1} href="https://www.scichart.com/javascript-chart-features">
                JavaScript Charts
            </a> |{" "}
            <a className={classes.link1} href="/">
                JavaScript Chart Examples
            </a> |{" "}
            <a className={classes.link1} href="/sitemap.xml">
                Sitemap
            </a>
        </div>
    );
}
