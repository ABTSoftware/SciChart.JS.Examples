import * as React from "react";
import { useLocation, useMatch } from "react-router-dom";
import { Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import {
    ALL_MENU_ITEMS,
    getParentMenuIds,
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
} from "./AppRouter/examples";
import AppBarTop from "./AppTopBar/AppBarTop";
import DrawerContent from "./DrawerContent/DrawerContent";
import AppFooter from "./AppFooter/AppFooter";
import { EXAMPLES_PAGES } from "./AppRouter/examplePages";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import classes from "./App.module.scss";
import "./index.scss";
import Gallery from "./Gallery/Gallery";
import { GalleryItem } from "../helpers/types/types";
import { generateExamplesGallery, getSeeAlsoGalleryItems } from "../helpers/SciChartExamples";
import { FrameworkContext } from "../helpers/shared/Helpers/FrameworkContext";
import { useExampleRouteParams } from "../helpers/shared/Helpers/frameworkParametrization";

export default function App() {
    const { isIFrame, isHomePage, currentExample, framework } = useExampleRouteParams();

    const selectedFramework = framework;

    const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    let initialOpenedMenuItems = {
        MENU_ITEMS_FEATURED_APPS_ID: true,
        MENU_ITEMS_3D_ID: true,
        MENU_ITEMS_2D_ID: true,
    };

    MENU_ITEMS_FEATURED_APPS.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });
    MENU_ITEMS_3D.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });
    MENU_ITEMS_2D.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>(initialOpenedMenuItems);

    const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);

    const currentExampleId = currentExample?.id;
    // SeeAlso is now optional on exampleInfo. Return this if provided else auto-generate from menu
    const seeAlso: GalleryItem[] =
        currentExample?.seeAlso ?? getSeeAlsoGalleryItems(ALL_MENU_ITEMS, currentExample, framework);

    // // Find the example category
    // const exampleCategory = ALL_MENU_ITEMS.find(menuItem => {
    //     return menuItem.submenu.find(subMenu => subMenu.id === examplePage.id) !== undefined;
    // });
    // // Generate the seeAlso gallery items
    // const seeAlso: GalleryItem[] = examplePage?.seeAlso;

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);
    const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

    React.useEffect(() => {
        if (window.location.hostname.includes("scichart.com")) {
            SciChartSurface.setRuntimeLicenseKey(
                "pcVGl35vQKAOUbnT78/jbkYSH6kBUK7/7Q6oe3SHHWHjExhdi7L/bZyu0uX1WO6xAcBvfO1XGSLW6IOCv+D1WBKlTdgg2I1Y7nrzVuB93iTIPlbQwA/U1i2i9JLWAVDJwL7Zh0yh9KXYj9UjhUmTmfvL7BKBbQpa7vQ2s68q9V9ID1vWIxdBQizWe1JpYj3tXLGtwdbqdFkjxFE7oNzf2CuXyFGGlt6/rW09tFapFlq18ZE5L702xmFPeX9qglbSdz+tsSkzR7X1lXbEOSHGpMU6dUxr4F4+Hkf5pU+M2/C4iTYBnYqFTM4RRAqVT7ckizLxH48guriguzRybtYyT7icQQussPE7humzM73IVfLi8jU25iB8C+42rc/NPImWoID6q4Evi3MD7zXTKp+QaIyheXo/ntgiaSFg+tBQ1WMUm+n+bdxGwrsDQdc5iDHpt56I9/qdGOKDC8yYY1BhwPbsFkPZ7XG9ahZFJ95cgemKl17lsxG7hAcF9a5tteVRXgmvg6a4B/4vVmi9Qb0/C2c0pGjCx9l+sVW6IL/5Qc2UOVIJAuO9mfh6uAj7RvLqE61V2OV71elCmn8IhjTEXyY6MIdcIN2ur1F671vZzE9nDgSy7OifbdEZKDJe/wweXDPrZ5E45guOcKZmSeE4y33SZdD6YJahSG9quYxyXNhZFYZWsNIUaB4vdSXD5hm3s8q/bXxaNjmJz743TpucwTT6bjbEFBmSaFXHL1LpsbeNE07IcJdPmbKfJz+Gr5kXjUpgAw=="
            );
        }

        SciChartDefaults.useSharedCache = true;
        if (currentExample) {
            const parentMenuIds = getParentMenuIds(currentExample.id);
            const updatedOpenedItems: Record<string, boolean> = { ...openedMenuItems };
            parentMenuIds.forEach((elId) => {
                updatedOpenedItems[elId] = true;
            });
            setOpenedMenuItems(updatedOpenedItems);
        }
    }, [currentExampleId]);

    if (isIFrame) {
        return <AppRouter currentExample={currentExample} seeAlso={seeAlso} isIFrame={true} />;
    }

    const allGalleryItems = generateExamplesGallery(framework);

    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];
    return (
        <FrameworkContext.Provider value={selectedFramework}>
            <div className={classes.App}>
                <Drawer
                    className={classes.DrawerMobile}
                    variant="temporary"
                    classes={{ paper: classes.DrawerPaper }}
                    anchor="right"
                    open={isMedium && isDrawerOpened}
                    onClose={toggleDrawer}
                >
                    <DrawerContent
                        testIsOpened={testIsOpened}
                        toggleOpenedMenuItem={toggleOpenedMenuItem}
                        toggleDrawer={toggleDrawer}
                    />
                </Drawer>
                <div className={classes.MainAppContent}>
                    <AppBarTop toggleDrawer={toggleDrawer} currentExample={currentExample} />
                    {isHomePage && <AppRouter currentExample={currentExample} seeAlso={[]} />}

                    <div className={classes.MainAppWrapper}>
                        <div className={classes.DrawerDesktop}>
                            <DrawerContent
                                testIsOpened={testIsOpened}
                                toggleOpenedMenuItem={toggleOpenedMenuItem}
                                toggleDrawer={() => {}}
                            />
                        </div>
                        {isHomePage ? (
                            <div className={classes.GalleryAppWrapper}>
                                <Gallery examples={allGalleryItems} />
                            </div>
                        ) : (
                            <AppRouter currentExample={currentExample} seeAlso={seeAlso} />
                        )}
                    </div>

                    <AppFooter />
                </div>
            </div>
        </FrameworkContext.Provider>
    );
}
