import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D,
    MENU_ITEMS_3D_ID,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_FEATURED_APPS_ID
} from "../AppRouter/examples";
import FooterGrid from "./FooterGrid";
import { useHistory } from "react-router-dom";
import { Box, Link, Typography } from "@material-ui/core";
// import "./AppFooter.scss";
// import sas from "./AppFooter.module.scss";

export type TFooterlink = {
    link: string;
    text: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        overflow: "hidden",
        backgroundColor: "#1E252B",
        color: "white",
        fontFamily:
            "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol"
    },
    link1: {
        color: "#BAC0C6",
        marginRight: "10px"
    },
    siteLinks: {
        display: "flex"
    }
}));

export default function AppFooter() {
    const classes = useStyles();

    const history = useHistory();

    const historyPushPath = (path: string) => {
        if (!path) return;
        history.push(path);
    };

    return (
        <>
            <div className="Some">
            {/* <div className={sas.Card}> */}
                <Box mb={4}>
                    <Typography variant="h4">All JavaScript Chart Examples</Typography>
                </Box>
                <FooterGrid
                    historyPushPath={historyPushPath}
                    title="Featured Apps"
                    menuItems={MENU_ITEMS_FEATURED_APPS}
                    menuItemsId={MENU_ITEMS_FEATURED_APPS_ID}
                />
                <FooterGrid
                    historyPushPath={historyPushPath}
                    title="2D Charts"
                    menuItems={MENU_ITEMS_2D}
                    menuItemsId={MENU_ITEMS_2D_ID}
                />
                <FooterGrid
                    historyPushPath={historyPushPath}
                    title="3D Charts"
                    menuItems={MENU_ITEMS_3D}
                    menuItemsId={MENU_ITEMS_3D_ID}
                />
                <Box mb={3}>
                    <Typography variant="h4">SciChart.js: Fast, Realtime, High Performance </Typography>
                    <Box mt={1} className={classes.siteLinks}>
                        <Link
                            className={classes.link1}
                            title="JavaScript Charts"
                            href="https://www.scichart.com/javascript-chart-features"
                        >
                            <Typography>JavaScript Charts</Typography>
                        </Link>

                        <Link className={classes.link1} title="JavaScript Chart Examples" href="/">
                            <Typography> JavaScript Chart Examples</Typography>
                        </Link>

                        <Link className={classes.link1} title="Sitemap" href="/sitemap.xml">
                            <Typography> Sitemap</Typography>
                        </Link>
                    </Box>
                </Box>
            </div>
        </>
    );
}
