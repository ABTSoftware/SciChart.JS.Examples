import * as React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import { getParentMenuIds } from "./AppRouter/examples";
import AppBarTop from "./AppTopBar/AppBarTop";
import DrawerContent from "./DrawerContent/DrawerContent";
import AppFooter from "./AppFooter/AppFooter";
import { EXAMPLES_PAGES } from "./AppRouter/examplePages";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";

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

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);
    const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

    // For deployment to demo.scichart.com we are getting the license from the server where it is set by enviroment variable.
    // When you npm run dev, the beta trial key is served by the webpack dev server (webpack.client.no_server.config)
    fetch("/api/license").then(r => r.text()).then(key => SciChartSurface.setRuntimeLicenseKey(key));

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
                <AppRouter currentExample={currentExample} />
                <AppFooter />
            </div>
        </div>
    );
}
