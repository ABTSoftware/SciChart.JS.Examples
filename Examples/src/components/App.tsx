import * as React from "react";
import "scichart-react/configureDefaults";
import { Helmet } from "react-helmet";
import AppRouter from "./AppRouter/AppRouter";
import "./Examples/styles/sc-main.css";
import "./Examples/styles/sc-app.css";
import "./Examples/styles/sc-gallery.css";
import "./Examples/styles/sc-content.css";
import "./Examples/styles/sc-editor.css";
import DrawerContent from "./DrawerContent/DrawerContent";
import AppFooter from "./AppFooter/AppFooter";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import { generateExamplesGallery } from "../helpers/SciChartExamples";
import { StateProvider, _useContext } from "../helpers/shared/Helpers/Context";
import AppDetailsRouter from "./AppDetailsRouters/AppDetailsRouter";
import { Link, useNavigate } from "react-router";
import { appTheme } from "./Examples/theme";
import { SciChartSurfaceBase } from "scichart";
import { ContentSectionRouter } from "./Navigation/AnchorTagRouter";
import GalleryItems from "./GalleryItems";
import SciChartNavbar from "./SciChartNavbar/SciChartNavbar";
import { useMediaQuery } from "../helpers/useMediaQuery";
import { MobileDrawer } from "./DrawerContent/MobileDrawer";
import { baseAppPath } from "../constants";
// scichart-react applies its own defaults (wasmUrl: "/scichart.wasm") at import time.
// Example components are pulled in lazily via require.context, so without this eager import
// those defaults would run *after* the SciChartSurface.configure call below and clobber it.
import "scichart-react/configureDefaults";

SciChartSurfaceBase.DEFAULT_THEME = appTheme.SciChartJsTheme;
SciChartDefaults.useSharedCache = true;
SciChartDefaults.autoFontName = "Arial";

const NotFound = () => (
    <div
        style={{
            textAlign: "center",
            padding: "3.125rem 1.25rem",
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

const EXAMPLE_NAVIGATION_STORAGE_KEY = "scichart-demo-example-navigation-open";

const ChatbotScript = (): React.ReactElement | null => {
    React.useEffect(() => {
        const hostname = window.location.hostname;
        if (hostname !== "scichart.com" && !hostname.endsWith(".scichart.com")) return undefined;
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

// Override the wrapper's import-time defaults with the application's WASM base path.
SciChartSurface.configure({
    wasmUrl: `${baseAppPath}/scichart.wasm`,
});

export default function App() {
    return (
        <StateProvider>
            <AppContent />
        </StateProvider>
    );
}

function AppContent() {
    const { state } = _useContext();
    const { isIFrame, isHomePage, currentExample, framework, is404 } = state;
    const navigate = useNavigate(); // Hook to programmatically navigate

    const isMedium = useMediaQuery("(max-width: 959.98px)");

    const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);
    const [isExampleNavigationOpen, setIsExampleNavigationOpen] = React.useState(true);
    const [mostVisibleCategory, setMostVisibleCategory] = React.useState<string | null>(null);

    const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

    React.useEffect(() => {
        try {
            setIsExampleNavigationOpen(window.localStorage.getItem(EXAMPLE_NAVIGATION_STORAGE_KEY) !== "false");
        } catch {
            // Keep the default when browser storage is unavailable.
        }
    }, []);

    const toggleExampleNavigation = () => {
        setIsExampleNavigationOpen((isOpen) => {
            const nextIsOpen = !isOpen;
            try {
                window.localStorage.setItem(EXAMPLE_NAVIGATION_STORAGE_KEY, String(nextIsOpen));
            } catch {
                // Keep the toggle usable when browser storage is unavailable.
            }
            return nextIsOpen;
        });
    };

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
    }, []);

    if (isIFrame) {
        return <AppRouter />;
    }

    const allGalleryItems = generateExamplesGallery(framework);

    return (
        <>
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
                    width: calc(100vw - 2.5rem) !important;
                    height: calc(100vh - var(--sc-app-drawer-top) - 2.5rem) !important;
                    right: 1.25rem !important;
                    bottom: 1.25rem !important;
                    left: auto !important;
                    top: auto !important;
                }
                @media screen and (min-width: 960px) {
                    .chatbot-maximised {
                        width: calc(100vw - min(21.875rem, 25vw) - 2.5rem - 1.25rem) !important;
                    }
                }
                `}
            </style>
            <ChatbotScript />

            <div className="sc-app-root">
                {isMedium && (
                    <MobileDrawer open={isDrawerOpened} onClose={toggleDrawer}>
                        <DrawerContent onClose={toggleDrawer} />
                    </MobileDrawer>
                )}
                <div className="sc-app-content">
                    <SciChartNavbar
                        toggleDrawer={toggleDrawer}
                        showMenuToggle={isMedium && (isHomePage || is404)}
                    />

                    {is404 ? (
                        <NotFound />
                    ) : isHomePage ? (
                        <div className="sc-app-gallery-layout">
                            {!isMedium ? (
                                <div className="sc-app-home-drawer">
                                    <DrawerContent mostVisibleCategory={mostVisibleCategory} />
                                </div>
                            ) : null}

                            <div className="sc-app-gallery-content">
                                <GalleryItems
                                    examples={allGalleryItems}
                                    setMostVisibleCategory={setMostVisibleCategory}
                                />
                            </div>
                        </div>
                    ) : (
                        <AppDetailsRouter
                            isExampleNavigationOpen={isExampleNavigationOpen}
                            isNarrowViewport={isMedium}
                            toggleExampleNavigation={toggleExampleNavigation}
                        />
                    )}

                    <AppFooter />
                </div>
            </div>
            <ContentSectionRouter />
        </>
    );
}
