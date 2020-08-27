import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useLocation } from "react-router-dom";
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

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(2),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
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
        },
        colNav: {
            flexBasis: 240,
            flexShrink: 0,
            flexGrow: 0,
        },
        colMain: {
            flexBasis: 240,
            flexShrink: 0,
            flexGrow: 1,
            marginLeft: theme.spacing(2),
        },
        colDescription: {
            flexBasis: 360,
            flexGrow: 0,
            flexShrink: 0,
            paddingLeft: theme.spacing(2),
        },
        description: {
            marginBottom: theme.spacing(2),
        },
    }),
    { index: 1 }
);

export default function App() {
    const classes = useStyles();
    const location = useLocation();

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>({});

    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === location.pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    const currentExampleId = currentExample?.id;
    const titleText = currentExample ? currentExample.title : HOME_PAGE_TITLE;
    const subtitleText = currentExample ? currentExample.subtitle : "";
    const descriptionText = currentExample ? currentExample.description : "";
    const codeStr = currentExample ? currentExample.code : "";

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);

    React.useEffect(() => {
        if (currentExample) {
            const parentMenuIds = getParentMenuIds(currentExample.id);
            const updatedOpenedItems: Record<string, boolean> = {...openedMenuItems};
            parentMenuIds.forEach((elId) => {
                updatedOpenedItems[elId] = true;
            });
            setOpenedMenuItems(updatedOpenedItems);
        }
    }, [currentExampleId]);

    const checkIsOpened = (id: string): boolean => !!openedMenuItems[id];

    return (
        <div className={classes.root}>
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
                <div className={classes.colNav}>
                    <Navigation checkIsOpened={checkIsOpened} onExpandClick={toggleOpenedMenuItem} />
                </div>
                <div className={classes.colMain}>
                    <Title title={titleText} subtitle={subtitleText} />
                    <AppRouter />
                    {currentExample && <SourceCode code={codeStr} />}
                </div>
                <div className={classes.colDescription}>
                    {descriptionText && (
                        <div className={classes.description}>
                            <Description>
                                <div>{descriptionText}</div>
                            </Description>
                        </div>
                    )}
                    <GettingStarted />
                </div>
            </div>
        </div>
    );
}
