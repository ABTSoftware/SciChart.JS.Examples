import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router";
import App from "./components/App";
import { customTheme } from "./theme";
import "./components/index.scss";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./createEmotionCache";
import {
    defaultSourceFilesVariant,
    SourceFilesContext,
} from "./components/AppDetailsRouters/SourceFilesLoading/SourceFilesContext";
import { baseAppPath } from "./constants";

const cache = createEmotionCache();

function Main() {
    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={customTheme}>
                <SourceFilesContext.Provider value={defaultSourceFilesVariant}>
                    <BrowserRouter basename={baseAppPath}>
                        <App />
                    </BrowserRouter>
                </SourceFilesContext.Provider>
            </ThemeProvider>
        </CacheProvider>
    );
}

const rootElement = document.querySelector("#react-root");
if (process.env.NODE_ENV === "production") {
    hydrateRoot(rootElement, <Main />);
} else {
    const root = createRoot(rootElement);
    root.render(<Main />);
}
