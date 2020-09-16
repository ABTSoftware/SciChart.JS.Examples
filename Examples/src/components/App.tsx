import * as React from "react";
import { useLocation, useHistory } from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Navigation from "./Navigation/Navigation";
import AppRouter from "./AppRouter/AppRouter";
import Search from "./Search/Search";
import sciChartLogoImg from "../images/scichart-logo-making-impossible-projects-possible@2x.png";
import { EXAMPLES_PAGES, getParentMenuIds } from "./AppRouter/examples";
import Title from "./Title/Title";
import { HOME_PAGE_TITLE } from "./PageHome";
import Description from "./Description/Description";
import GettingStarted from "./GettingStarted/GettingStarted";
import SourceCode from "./SourceCode/SourceCode";

// tslint:disable-next-line:no-var-requires
const APP_VERSION = require("../../package.json").dependencies.scichart;

const drawerWidth = 240;

const useStyles = makeStyles(
    (theme) => ({
        root: {
            display: "flex",
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        toolbar: {
            ...theme.mixins.toolbar,
            paddingLeft: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        header: {
            display: "flex",
        },
        headerLeft: {
            flexBasis: 500,
            flexGrow: 1,
            flexShrink: 0,
        },
        headerRight: {
            flexBasis: 209,
            flexGrow: 0,
            flexShrink: 0,
            paddingLeft: theme.spacing(2),
        },
        body: {
            display: "flex",
            fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
        },
        colMain: {
            flexBasis: 240,
            flexShrink: 0,
            flexGrow: 1,
            maxWidth: 900,
        },
        colDescription: {
            flexBasis: 360,
            flexGrow: 0,
            flexShrink: 0,
            paddingLeft: theme.spacing(3),
        },
        description: {
            marginBottom: theme.spacing(2),
        },
        test: {
            marginBottom: 20.
        }
    }),
    { index: 1 }
);

export default function App() {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>({});

    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === location.pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    const currentExampleId = currentExample?.id;
    const titleText = currentExample ? currentExample.title : HOME_PAGE_TITLE;
    const subtitleText = currentExample ? currentExample.subtitle() : undefined;
    const DescComponent: () => JSX.Element = currentExample?.description;
    const codeStr = currentExample ? currentExample.code : "";
    const githubUrl = currentExample ? currentExample.githubUrl : "";

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);

    React.useEffect(() => {
        if (currentExample) {
            const parentMenuIds = getParentMenuIds(currentExample.id);
            const updatedOpenedItems: Record<string, boolean> = { ...openedMenuItems };
            parentMenuIds.forEach((elId) => {
                updatedOpenedItems[elId] = true;
            });
            setOpenedMenuItems(updatedOpenedItems);
        }
    }, [currentExampleId]);

    const checkIsOpened = (id: string): boolean => !!openedMenuItems[id];

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar}>
                    <Typography
                        variant="h6"
                        style={{ color: "rgba(0, 0, 0, 0.54)", cursor: "pointer" }}
                        onClick={() => history.push("/")}
                    >
                        SciChart.js
                    </Typography>
                    <Typography variant="caption" style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                        {`v${APP_VERSION}`}
                    </Typography>
                </div>
                <Divider />
                <Navigation checkIsOpened={checkIsOpened} onExpandClick={toggleOpenedMenuItem} />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.header}>
                    <Typography className={classes.headerLeft} variant="h4" variantMapping={{ h4: "h1" }} gutterBottom>
                        SciChart.js - High Performance Realtime Javascript Charts Examples Suite
                    </Typography>
                    <div className={classes.headerRight}>
                        <img src={sciChartLogoImg} width={209} height={42} />
                    </div>
                </div>
                <Search />
                <div className={classes.body}>
                    <div className={classes.colMain}>
                        <div className="title">
                            <Title title={titleText}></Title>
                            <div className={classes.test}>{subtitleText}</div>
                        </div>
                        <AppRouter />
                        {currentExample && <SourceCode code={codeStr} githubUrl={githubUrl} />}
                    </div>
                    <div className={classes.colDescription}>
                        {DescComponent && (
                            <div className={classes.description}>
                                <Description>
                                    <DescComponent />
                                </Description>
                            </div>
                        )}
                        <GettingStarted />
                    </div>
                </div>
            </main>
        </div>
    );
}
