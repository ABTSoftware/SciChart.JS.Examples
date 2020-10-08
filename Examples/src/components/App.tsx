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
    SciChartSurface.setRuntimeLicenseKey("W9sg5k3SYADvsWnOzsgqvl6L5xyq3+V9F/L+DUUkX1uLfHF5wclegUL8FasY2ywkoAvAU3V2tKqxsqyK9+OBDt6lQ2kbCd25nzei7QtjExEK6/EiHvxAMSUL/qu5fb0JzGPLRBpTqNT2ylndyYiyjciUmnYaeOzSINo5/ybyuMf4RHn7chGUoUNUy2P4nkclt9oO14izrm8zDd3obnTkoj1a9q2TAOLW8I5qxCTZppasnTW8lS2jVRFwuJloNqEy79wjhPyeEf3FiSt7xXa0HkPejNic9rX7eq2FKH8Feay5WVLD/63IbKUlzrEJC2l+b7VHGQGW6w4zwP9Jr1aJJ+3ZbqB7e3yUpFz7zkJ7pj3hmJe9S/SNQYnE0MlaTBUx+kpw59iTxyTNzt9E3GtnC5UDRcDX7IkJ/f1aKpROPHZGSrMf4d78KRfqhVDHfOWjJcBstMs/rgWDT60uHmyeBnpBiOJLoNxoXF1JgWP7RtPiGGPs+uRhi885zQ9ap3lrCMnqvm4lGSFXx45ieMwoLajpVMxebw0nUwAizn/GOEHB/Pk4CYs82Wd4ts4na0T62X6vdlp01ryDV3SkFatZaxfK5m23hw0OZ0NNMltAZ8m4BhJ0+sOXtAhvmhYFhzvKhUNaIk9n9NV5DsKc9dbyPn4QC8Vs+HSzNOE=");

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
