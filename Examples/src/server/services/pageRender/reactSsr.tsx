import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";

import App from "../../../components/App";
import { customTheme } from "../../../theme";
import {
    defaultSourceFilesVariant,
    SourceFilesContext,
} from "../../../components/AppDetailsRouters/SourceFilesLoading/SourceFilesContext";
import { SourceFilesVariant } from "../../../helpers/types/types";
import { renderIndexHtml } from "../../renderIndexHtml";
import createEmotionCache from "../../../createEmotionCache";

export function renderPage(url: string, sourceFilesInfo: SourceFilesVariant = defaultSourceFilesVariant) {
    // Create an emotion cache for SSR
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    // Render the component to a string.
    const appHtml = ReactDOMServer.renderToString(
        <CacheProvider value={cache}>
            <ThemeProvider theme={customTheme}>
                <SourceFilesContext.Provider value={sourceFilesInfo}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </SourceFilesContext.Provider>
            </ThemeProvider>
        </CacheProvider>
    );

    // Extract the critical CSS
    const emotionChunks = extractCriticalToChunks(appHtml);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);

    // SEO tags
    const helmet = Helmet.renderStatic();

    return renderIndexHtml(appHtml, emotionCss, helmet);
}
