import * as React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import sciChartLogoImg from "../images/scichart-logo-making-impossible-projects-possible@2x.png";
import { EXAMPLES_PAGES, getParentMenuIds } from "./AppRouter/examples";
import Title from "./Title/Title";
import { HOME_PAGE_TITLE } from "./PageHome";
import Description from "./Description/Description";
import GettingStarted from "./GettingStarted/GettingStarted";
import SourceCode from "./SourceCode/SourceCode";
import AppBarTop from "./AppTopBar/AppBarTop";
import DrawerContent from "./DrawerContent/DrawerContent";

const drawerWidth = 240;

const useStyles = makeStyles(
    theme => ({
        root: {
            display: "flex",
            [theme.breakpoints.down("md")]: {
                display: "block"
            }
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0
        },
        drawerPaper: {
            width: drawerWidth
        },
        main: {
            flexGrow: 1,
            padding: 0
        },
        mainContent: {
            margin: theme.spacing(2)
        },
        sciChartLogo: {
            textAlign: "right",
            marginBottom: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                display: "none"
            }
        },
        body: {
            display: "flex",
            fontFamily:
                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
            [theme.breakpoints.down("sm")]: {
                display: "block"
            }
        },
        colMain: {
            flexBasis: 240,
            flexShrink: 0,
            flexGrow: 1,
            overflowX: "auto",
            marginBottom: theme.spacing(3)
        },
        colMainContent: {
            maxWidth: 900,
            margin: "auto"
        },
        colDescription: {
            flexBasis: 360,
            flexGrow: 0,
            flexShrink: 0,
            paddingLeft: theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
                paddingLeft: 0
            },
            marginBottom: theme.spacing(3)
        },
        description: {
            marginBottom: theme.spacing(3)
        },
        title: {
            marginTop: theme.spacing(3),
        },
        subtitle: {
            marginBottom: 20
        }
    }),
    { index: 1 }
);

export default function App() {
    const classes = useStyles();
    const location = useLocation();
    const isLarge = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>({});
    const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);

    const drawerVariant = isLarge ? "permanent" : "temporary";
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find(key => EXAMPLES_PAGES[key].path === location.pathname);
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
    const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

    React.useEffect(() => {
        if (currentExample) {
            const parentMenuIds = getParentMenuIds(currentExample.id);
            const updatedOpenedItems: Record<string, boolean> = { ...openedMenuItems };
            parentMenuIds.forEach(elId => {
                updatedOpenedItems[elId] = true;
            });
            setOpenedMenuItems(updatedOpenedItems);
        }
    }, [currentExampleId]);

    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant={drawerVariant}
                classes={{ paper: classes.drawerPaper }}
                anchor="left"
                open={isLarge ? true : isDrawerOpened}
                onClose={toggleDrawer}
            >
                <DrawerContent
                    testIsOpened={testIsOpened}
                    toggleOpenedMenuItem={toggleOpenedMenuItem}
                    toggleDrawer={toggleDrawer}
                />
            </Drawer>
            <div className={classes.main}>
                <AppBarTop toggleDrawer={toggleDrawer} />
                <div className={classes.mainContent}>
                    <div className={classes.body}>
                        <div className={classes.colMain}>
                            <div className={classes.colMainContent}>
                                <Typography variant="h5" variantMapping={{ h4: "h1" }} gutterBottom>
                                    SciChart.js - High Performance Realtime Javascript Charts Examples Suite
                                </Typography>
                                <div className={classes.title}>
                                    <Title title={titleText} />
                                    <div className={classes.subtitle}>{subtitleText}</div>
                                </div>
                                <AppRouter />
                                {currentExample && <SourceCode code={codeStr} githubUrl={githubUrl} />}
                            </div>
                        </div>
                        <div className={classes.colDescription}>
                            <div className={classes.sciChartLogo}>
                                <img src={sciChartLogoImg} width={209} height={42} />
                            </div>
                            <GettingStarted />
                            {DescComponent && (
                                <div className={classes.description}>
                                    <Description>
                                        <DescComponent />
                                    </Description>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
