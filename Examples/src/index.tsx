import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { customTheme } from "./theme";
import "./components/index.scss";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./createEmotionCache";

const cache = createEmotionCache();

function Main() {
    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={customTheme}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
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
