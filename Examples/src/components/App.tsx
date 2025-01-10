import * as React from "react";
import { Theme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import {
    ALL_MENU_ITEMS,
    getParentMenuIds,
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
} from "./AppRouter/examples";
import AppBarTop from "./AppTopBar/AppBarTop";
//import SciChartNavbar from "./SciChartNavbar/SciChartNavbar";
import DrawerContent from "./DrawerContent/DrawerContent";
import AppFooter from "./AppFooter/AppFooter";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import classes from "./App.module.scss";
import "./index.scss";
import { ETheme, GalleryItem } from "../helpers/types/types";
import { generateExamplesGallery, getSeeAlsoGalleryItems } from "../helpers/SciChartExamples";
import { FrameworkContext } from "../helpers/shared/Helpers/FrameworkContext";
import { useExampleRouteParams } from "../helpers/shared/Helpers/frameworkParametrization";
import AppDetailsRoute from "./AppDetailsRouters/AppDetailsRouter";
import { useNavigate } from "react-router-dom";
import { appTheme } from "./Examples/theme";
import { SciChartSurfaceBase } from "scichart";
import { ContentSectionRouter } from "./Navigation/AnchorTagRouter";
import GalleryItems from "./GalleryItems";

SciChartSurfaceBase.DEFAULT_THEME = appTheme.SciChartJsTheme;
SciChartDefaults.useSharedCache = true;

export default function App() {
    const { isIFrame, isHomePage, currentExample, framework } = useExampleRouteParams();
    const navigate = useNavigate(); // Hook to programmatically navigate

    const [theme, setTheme] = React.useState<ETheme>();

    const selectedFramework = framework;

    // TODO md was changed by migration script.requires verification
    const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    let initialOpenedMenuItems = {
        MENU_ITEMS_FEATURED_APPS_ID: false,
        MENU_ITEMS_3D_ID: false,
        MENU_ITEMS_2D_ID: false,
    };

    MENU_ITEMS_FEATURED_APPS.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.id]: true };
    });
    MENU_ITEMS_3D.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.id]: true };
    });
    MENU_ITEMS_2D.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.id]: true };
    });

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>(initialOpenedMenuItems);

    const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);
    const [mostVisibleCategory, setMostVisibleCategory] = React.useState<string | null>(null);

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

    const toggleOpenedMenuItem = (id: string) => {
        setOpenedMenuItem(id, !openedMenuItems[id]);
    };
    const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

    React.useEffect(() => {
        const currentPath = window.location.pathname;

        // Check if the path is exactly "/" or empty (no path after the base URL)
        if (currentPath === "/" || currentPath === "") {
            navigate("/react", { replace: true }); // Redirect to /react by default
        }
    }, [navigate]);

    React.useEffect(() => {
        setTheme(
            window && window?.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                ? ETheme.dark
                : ETheme.light
        );
    }, []);

    React.useEffect(() => {
        if (window.location.hostname.includes("scichart.com")) {
            SciChartSurface.setRuntimeLicenseKey(
                "pqBR9USXrUYonp3XxWCzOXU7ReW/ATBFgopoC8UunDgJAZuC54FOEnpCOzSq3OOZWTtVhOqxG9cVDoaVpHvazfysu40/7jhBsb6by6GAQ4ndAJ4t8lTqXQpiaNGSmEIox/Lguq4dU5ijX1B5hzzsop4AYoWJeuKh0+VTxNtLhjq9yvCWuNtrveKiGGofcUK1N1R00T8DAdK3Q0o849f/UhGY+5xGWVGCwglQT+zT+ARFX/j6jRJ19nxVvpTjOu4/e5DmdH5Lm/dMW6EGIWQjvhmeqHSZixwwkJJaH7XIJzZ5IHUTmm567R4RujVNRITaJJLFX2eLmxtryE0pdc83RrJoSBtPBVQv6WNt+ve8l+vci4Kga9u55dd72nhTnzUTuiZQ9Lsyq+rJsr9cQrH6wHDKyQqqYlLzbxjcGZPAmh/QD6EyNec02wXJLYYqvDRxit1nYWajeA6V0G6lT8Yc8xe4PIPk5Wpr7Wt8q4YjcxOnPPWzwcYcid/jGvyxXq7E/pTai7TH6ol2FYaDKdb+EjqUPtImYcxJu4nAr1SRlmAbc+cdImjnWdRGncQBlQKSZFdipOHS0TMVJcDnFYRjOD7Y8A8fpK372Qzl8CpJn2mJhgW21S+522Ym5A6VXCI4aKWVVkb0XTBER9F0DCUb2N2zW8Hd6aj3US6L21g+mEt/EGwjw/cyOPz2ElXvuANOP/sG34U2HG8eUfGANWqEDbCUn2XGUrLbOLaL8bItVlqKmwa/fBgJ6AOw0c7WRn7BPpUG6w=="
            );
        }

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
                {isMedium && (
                    <Drawer
                        className={classes.DrawerMobile}
                        variant="temporary"
                        classes={{ paper: classes.DrawerPaper }}
                        anchor="right"
                        open={isDrawerOpened}
                        onClose={toggleDrawer}
                    >
                        <DrawerContent
                            testIsOpened={testIsOpened}
                            toggleOpenedMenuItem={toggleOpenedMenuItem}
                            toggleDrawer={toggleDrawer}
                            // mostVisibleCategory={mostVisibleCategory} mobile does not need this hover feature
                        />
                    </Drawer>
                )}
                <div className={classes.MainAppContent}>
                    <AppBarTop
                        toggleDrawer={toggleDrawer}
                        currentExample={currentExample}
                        theme={theme}
                        setTheme={setTheme}
                    />
                    {/* <SciChartNavbar /> */}

                    {isHomePage && <AppRouter currentExample={currentExample} seeAlso={[]} />}

                    {!isHomePage ? (
                        <AppDetailsRoute currentExample={currentExample} seeAlso={seeAlso} theme={theme} />
                    ) : (
                        <div className={classes.MainAppWrapper}>
                            {!isMedium ? (
                                <div className={classes.DrawerDesktop}>
                                    <DrawerContent
                                        testIsOpened={testIsOpened}
                                        toggleOpenedMenuItem={toggleOpenedMenuItem}
                                        toggleDrawer={toggleDrawer}
                                        mostVisibleCategory={mostVisibleCategory}
                                    />
                                </div>
                            ) : null}
                            {isHomePage ? (
                                <div className={classes.GalleryAppWrapper}>
                                    <GalleryItems
                                        examples={allGalleryItems}
                                        setMostVisibleCategory={setMostVisibleCategory}
                                    />
                                </div>
                            ) : (
                                <AppRouter currentExample={currentExample} seeAlso={seeAlso} />
                            )}
                        </div>
                    )}

                    <AppFooter />
                </div>
            </div>
            <ContentSectionRouter />
        </FrameworkContext.Provider>
    );
}
