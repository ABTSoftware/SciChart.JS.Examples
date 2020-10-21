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
        color: "white"
    },
    link1: {
        color: "white",
    },
}));

export default function AppFooter() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            SciChart: Fast, Realtime, High Performance{" "}
            <a className={classes.link1} href="https://www.scichart.com/javascript-chart-features">
                JavaScript Charts
            </a>{" "}
            Examples Suite.{" "}
            <a className={classes.link1} href="/sitemap.xml">
                Sitemap
            </a>
        </div>
    );
}
