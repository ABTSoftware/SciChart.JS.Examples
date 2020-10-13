import * as React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import { EXAMPLES_PAGES, getParentMenuIds } from "./AppRouter/examples";
import AppBarTop from "./AppTopBar/AppBarTop";
import DrawerContent from "./DrawerContent/DrawerContent";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { setLicenseDebug } from "scichart/Charting/Visuals/licenseManager2D";

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
    SciChartSurface.setRuntimeLicenseKey("Hk9YxKmb39TbYgZnw5y8CFv55dT7j7SQhJfgpDWokfBuG3B56CDn39Ms1RMyv1Qd0eirY6Idg5im+QeYis+2+LAh6LJ79u0r6tmjXAXK70xEryahZM2hJ6FyWemnoweRB48FwX0RALe3ekWrMczS2Hz6E6MRdAcjewKaKZSCV7+jz7RjOqHc+4pMzcfbjKJrAPf31xNuEutikQdoznh8vUU/P/pV4TGgJcLCIkW95t7WXXdggJPZhhM//A4ebZV5LNLZ/000cRIDh8zd3yE/sLer9TAn6urva9qhYJD7uUAaoguxMq0aPLCSf/MPjRBHYTaZ7IBsxnkM56eNyy7BSGsOir9yR9VWcK7RpobGc1jkW2nigG1o9YDvX6Xf/1vsmCeGwiGMWP3fDWyLbeBwAuaWMgw6zfoVai6QIaP4MiNQEv4RY8fovF4Pdz9Dlky1yGXVDLs7Ip/RbLrAsX83W67W9ESsTYueKo9+s586twswBUPEc6w3lLivQLKjCgWPuKLaEOxOTbMqhw3ThfEenUx4mxy+Ndyezaebo83yHv3aFgOpV27UtMM/n6gZzuo1Iji+YUEved9EQ5VatBV+Xm4cQ8A9HzzOCawP5uIVhBXRh0Uqc7Ar56bfKdm0HZ1a/7CuL0FVZ2K9vvYx9ddQKaGXOUSntbkzD3nZMV7wr3s3Q/mFDWMIyYJSjQgn2WJNlPRuN72jrXhdGk9ap2aO229gm5yzDUu2svrArm+WB7DdeTSCdimy57Uz1V+mRCHHNWNWjCK0VT1gFQ==");

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
            </div>
        </div>
    );
}
