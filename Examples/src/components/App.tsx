import * as React from "react";
import { Theme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Helmet } from "react-helmet";
import AppRouter from "./AppRouter/AppRouter";
import {
    ALL_MENU_ITEMS,
    getParentMenuIds,
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
} from "./AppRouter/examples";
// import AppBarTop from "./AppTopBar/AppBarTop";
import DrawerContent from "./DrawerContent/DrawerContent";
import AppFooter from "./AppFooter/AppFooter";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import classes from "./App.module.scss";
import "./index.scss";
import { GalleryItem } from "../helpers/types/types";
import { generateExamplesGallery, getSeeAlsoGalleryItems } from "../helpers/SciChartExamples";
import { StateProvider } from "../helpers/shared/Helpers/Context";
import { useExampleRouteParams } from "../helpers/shared/Helpers/frameworkParametrization";
import AppDetailsRouter from "./AppDetailsRouters/AppDetailsRouter";
import { Link, useNavigate } from "react-router";
import { appTheme } from "./Examples/theme";
import { SciChart3DSurface, SciChartSurfaceBase } from "scichart";
import { ContentSectionRouter } from "./Navigation/AnchorTagRouter";
import GalleryItems from "./GalleryItems";
import SciChartNavbar from "./SciChartNavbar/SciChartNavbar";
import { baseAppPath } from "../constants";

SciChartSurfaceBase.DEFAULT_THEME = appTheme.SciChartJsTheme;
SciChartDefaults.useSharedCache = true;
SciChartDefaults.autoFontName = "Arial";

const NotFound = () => (
    <div
        style={{
            textAlign: "center",
            padding: "50px 20px",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}
    >
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/react">Go back to the home page</Link>
    </div>
);

const ChatbotScript = (): React.ReactElement | null => {
    React.useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://chat.scichart.com/chatbot.js";
        script.type = "text/javascript";
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null;
};

SciChartSurface.configure({
    wasmUrl: `${baseAppPath}/scichart2d.wasm`,
});

SciChart3DSurface.configure({
    wasmUrl: `${baseAppPath}/scichart3d.wasm`,
});

export default function App() {
    const { isIFrame, isHomePage, currentExample, framework, is404 } = useExampleRouteParams();
    const navigate = useNavigate(); // Hook to programmatically navigate

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
        if (window.location.hostname.includes("scichart.com")) {
            SciChartSurface.setRuntimeLicenseKey(
                "H+Bf3l0m3O9Gx8d4X/vCChsFHOhjiTQ0T2lzaif9nz2klHiSfReMWWMGw2Cq4EuOyFgJRqRnlUrbnMIuRnnSu16d96IYP0XhtTJj0V7/ysnEdR7prle0i83/Ozaogy7X2wbeXM0iNBAjwbxJhkJfMtVVNCLh+jJN0122J1PImaqnohEeSO0E5BCGzya0a7tRMVzWOijgaO6CVPNyjfkccY07DgqjDgDKPQGhbgxCgPyvgHVwnLgbCG4p348eTEOGAmwQANZAVEAS5q3kul3OscYLLD+My0ArsWxushDi1xU1egn/pmfr7Mp3nMSpcMd2wv2QA9+XTJJIFGiYqtn95oDSeo5mrBF+mLekv8vMIvVsmvdAtclaTQMSSwXlAn4BpGTpzrMC9FZNTIyKGGBHR9Yhhp7rt1DhfTum1RPXo5j6ELYzqxL2/IuKnrjW3Oe8cOdiN5x9srgWCtFsEpxJBz07CSRutCzgEdwSrNMK6JJsHaWU6xgxlsPUHnWE1dDYmVbvgkKe+5lTsdGQ2wFIqp4/7nmKpm/pXEBPQyOk98PJ3rUKwCkDM7lz9HlheHD1I20BhUkJnVB4eVHrY/xCWvI+O/NutTIH+OAgD8FrwNnjTdCiqnq9pWsqEUjBIfg/noUuIciSUP6nCLiHxdn1fFr7d5xrJBvmsQF4p+5/NvAaCUgTY1NyV/rJhmQI8aLBnSlfCd0+hkKKiif9rhnbPJa2EG7+06e5897mUr5KvZeGXcQHcgSngSxxu9J+WEBtfszDhf4IAnq1LBoNc/Q="
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
        return (
            <StateProvider framework={framework}>
                <AppRouter currentExample={currentExample} seeAlso={seeAlso} isIFrame={true} />
            </StateProvider>
        );
    }

    const allGalleryItems = generateExamplesGallery(framework);

    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];
    return (
        <StateProvider framework={framework}>
            {isHomePage && (
                <Helmet>
                    <link rel="canonical" href={`https://www.scichart.com/demo/${framework}`} />
                    <meta
                        name="description"
                        content={`The Homepage of SciChart.js's High Performance ${
                            framework.slice(0, 1).toUpperCase() + framework.slice(1)
                        } Examples & Demos`}
                    />
                    <title>{`SciChart.js Demo | ${framework.slice(0, 1).toUpperCase() + framework.slice(1)}`}</title>
                </Helmet>
            )}
            <style>
                {`
                .chatbot-maximised {
                    width: calc(100vw - 40px) !important;
                    height: calc(100vh - 90px - 40px) !important;
                    right: 20px !important;
                    bottom: 20px !important;
                    left: auto !important;
                    top: auto !important;
                }
                @media screen and (min-width: 960px) {
                    .chatbot-maximised {
                        width: calc(100vw - min(350px, 25vw) - 40px - 20px) !important;
                    }
                }
                `}
            </style>
            <ChatbotScript />

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
                            currentExample={currentExample}
                            // mostVisibleCategory={mostVisibleCategory} mobile does not need this hover feature
                        />
                    </Drawer>
                )}
                <div className={classes.MainAppContent} style={{ position: "relative" }}>
                    <SciChartNavbar toggleDrawer={toggleDrawer} />

                    {is404 ? (
                        <NotFound />
                    ) : isHomePage ? (
                        <div className={classes.MainAppWrapper}>
                            {!isMedium ? (
                                <div className={classes.DrawerDesktop}>
                                    <DrawerContent
                                        testIsOpened={testIsOpened}
                                        toggleOpenedMenuItem={toggleOpenedMenuItem}
                                        toggleDrawer={toggleDrawer}
                                        currentExample={currentExample}
                                        mostVisibleCategory={mostVisibleCategory}
                                    />
                                </div>
                            ) : null}

                            <div className={classes.GalleryAppWrapper}>
                                <GalleryItems
                                    examples={allGalleryItems}
                                    setMostVisibleCategory={setMostVisibleCategory}
                                    needsH1={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <AppDetailsRouter currentExample={currentExample} seeAlso={seeAlso} />
                    )}

                    <AppFooter />
                </div>
            </div>
            <ContentSectionRouter />
        </StateProvider>
    );
}
