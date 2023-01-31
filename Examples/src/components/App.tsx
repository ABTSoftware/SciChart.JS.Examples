import * as React from "react";
import {Link, Navigate, Route, Routes, useLocation} from "react-router-dom";
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
import { PAGES } from "./AppRouter/pages";
import {GalleryItem} from "../helpers/types/types";
import {allGalleryItems, getSeeAlsoGalleryItems} from "../helpers/SciChartExamples";
import {REDIRECTION_RULES} from "./AppRouter/redirectionRules";

const NotFound = () => (
    <div style={{ textAlign: "center", margin: 50 }}>
        <h1 style={{ fontSize: "3em", margin: 50 }}>404 - Not Found!</h1>
        <Link to="/">Go Home</Link>
    </div>
)

export default function App() {
    const location = useLocation();

    // Process redirection rules first
    const pathWithoutSlash = location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname;
    if (REDIRECTION_RULES.has(pathWithoutSlash)) {
        return <Navigate  to={REDIRECTION_RULES.get(pathWithoutSlash)}/>
    }

    // For charts without layout we use '/iframe' prefix, for example '/iframe/javascript-multiline-labels'
    const isIFrame = location.pathname.substring(1, 7) === 'iframe';
    const pathname = isIFrame ? location.pathname.substring(7) : location.pathname;

    const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    let initialOpenedMenuItems = {
        MENU_ITEMS_FEATURED_APPS_ID: true,
        MENU_ITEMS_3D_ID: true,
        MENU_ITEMS_2D_ID: true,
    };

    MENU_ITEMS_FEATURED_APPS.forEach(item => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });
    MENU_ITEMS_3D.forEach(item => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });
    MENU_ITEMS_2D.forEach(item => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>(initialOpenedMenuItems);

    const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);

    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find(key => EXAMPLES_PAGES[key].path === pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    const currentExampleId = currentExample?.id;
    // SeeAlso is now optional on exampleInfo. Return this if provided else auto-generate from menu
    const seeAlso: GalleryItem[] = currentExample?.seeAlso ?? getSeeAlsoGalleryItems(ALL_MENU_ITEMS, currentExample);

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
        // For deployment to demo.scichart.com we are getting the license from the server
        // where it is set by environment variable.
        // When you npm run dev,
        // the beta trial key is served by the webpack dev server (webpack.client.no_server.config)
        // fetch("/api/license")
        //     .then(r => r.text())
        //     .then(key => SciChartSurface.setRuntimeLicenseKey(key));
        SciChartSurface.setRuntimeLicenseKey(
            "Ba+CO9zu9dtOPXWHd4ZSf62jLWJ2mWWzfLjGE/WG26CwypCj4VQ4UWY0ny44WPEyiEAvbu10cjdmLtCmTpIWsOdyga+mGQ66j3WlpyGfsZxrlWtexjJKNTed2LiDhsrQMwYm5MJEmKW0Vu69k/G51q+LEO2Pn3IIMoLCZvWHffo0ngugfC5ECFtx1laMNvPGmTlguswqCp/VIsBeKNGDadt2Bq9DPpCAh53+AQBDXhtW5GSu/KocQzTHc7cmNGEaumRohQteEfPonqNWDEhbQj+BS65c6Ha13Vi23XRtthKSVgjhicoyk50MU3G46Xvxnt5FRoGJ2y/f8up1ASXL4jzcZgY2Sy+d5FblwksjoMR+AB0DEwOwWK0Gj+v6BeH6T3pl4KYXjlVTn+suhQKNSUov2GXhZQWwZxdvaWNrcuZuNpQECZ7o7ffW5Qggh80euz4bFT8ARySoTPJCwcuIL2L4tJ/zbHqwB1wBmPQf2wKLMbdr1ZrXl6E53xBClavieC+zfuu11gcCYkCd2g3icvuzKnQ/mw6/Uu6wJOE27nv8dPR4neKanseE2/0tiL0hQgjGi6Q7ltgHK8dKlqBVbkjCiQ0X1dvEPdT+FopQu6RAMynoodtgJGXXMOxH4gFmO2J+9Cn0QATCRIeezLR7uyU9Eo0aYh7fDyfe7tZK0Gic/rrvECGby5OAqvJLfaKSO4JzKyAic/GqzD+hv9BIOTL3zbFH7TggaEfJXRXdsB1expogeN+AbL6YXX7WIIDuSYuG0w=="
        );

        SciChartDefaults.useSharedCache = true;
        if (currentExample) {
            const parentMenuIds = getParentMenuIds(currentExample.id);
            const updatedOpenedItems: Record<string, boolean> = { ...openedMenuItems };
            parentMenuIds.forEach(elId => {
                updatedOpenedItems[elId] = true;
            });
            setOpenedMenuItems(updatedOpenedItems);
        }
    }, [currentExampleId]);

    const isHttp404 = PAGES.homapage.path !== location.pathname && currentExampleKey === undefined;

    if (isIFrame && !isHttp404) {
        return <AppRouter currentExample={currentExample} seeAlso={seeAlso} isIFrame={true}/>
    }

    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];

    const pageContent = <>{PAGES.homapage.path === location.pathname && <AppRouter currentExample={currentExample} seeAlso={[]}/>}
        <div className={classes.MainAppWrapper}>
            <div className={classes.DrawerDesktop}>
                <DrawerContent
                    testIsOpened={testIsOpened}
                    toggleOpenedMenuItem={toggleOpenedMenuItem}
                    toggleDrawer={() => {
                    }}
                />
            </div>
            {PAGES.homapage.path === location.pathname ? (
                <div className={classes.GalleryAppWrapper}>
                    <Gallery examples={allGalleryItems}/>
                </div>
            ) : (
                <AppRouter currentExample={currentExample} seeAlso={seeAlso}/>
            )}
        </div>
    </>;


    return (
        <div className={classes.App}>
            <Drawer
                className={classes.DrawerMobile}
                variant="temporary"
                classes={{paper: classes.DrawerPaper}}
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
                <AppBarTop toggleDrawer={toggleDrawer} currentExample={currentExample}/>
                {isHttp404 ? <NotFound/> : pageContent}
                <AppFooter/>
            </div>
        </div>
    );
}
