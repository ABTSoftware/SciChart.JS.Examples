import * as React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import { getParentMenuIds } from "./AppRouter/examples";
import { EXAMPLES_PAGES } from "./AppRouter/examplePages";
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

    // LICENSING
    // To license the examples app locally for beta, uncomment the line below
    // SciChartSurface.setRuntimeLicenseKey("WcnXtRLwGVtfNA59XwvDQA11wSpykEA1NEpARELTB+Aq6kf2nJSK9GgWOKvCJA6P+jNg2xcVLw3oM7EdIIi0MJtvorAARa9au01LV/xLJ1jdOeDeMXpw/eT5ajSpukKcJXHe97tzsBzfB6wRziW6LgNjuB3ykFIk+tGvOmJyhRewYjF+FCSb/0q8Bq8em4lNmOfONzJz5spVWvvfHdn5iIYfvv00hhduow4bFzxXnRucLtHl2Bm1yFvrVYe0UOQcFpJ9DZ4S96GLhSw9SIkUSAy/C5r3FvdCkX8d40ehAg+n78w92QXwh4B41xF0f+9OHpeV3byaZDNr5L1afdS3qCahoyeYEnmt4hYdmGH3uS+KtC29bAcVXUqNA9P3pESndALjlEimVNfr6RrfKEY3jroWtPXEx2Oo9XcD3ZLUJiRrjDL0lTf/3a6+KN1xsl2K2eymqyo9Wggy7Mf3WymmvURil7SaxE3xBP5LWWGPMEXvf9m7vXGz6fkEtsZhdEC3HQprBwEGyV1zPdLxDqtWO9ltEBEBlS2FrzJ3984/zSp9sbc=");

    // For deployment to demo.scichart.com we are getting the license from the server where it is set by enviroment variable.
    // When you npm run dev, the beta trial key is served by the webpack dev server (webpack.client.no_server.config)
    SciChartSurface.setFetchLicenseCallback(() => fetch("/api/license").then(r => {
        if (r.ok) { return r.text(); }
        return "";
    }));
    
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
