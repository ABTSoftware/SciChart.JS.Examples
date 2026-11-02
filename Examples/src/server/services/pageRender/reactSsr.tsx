import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";

import App from "../../../components/App";
import {
    defaultSourceFilesVariant,
    SourceFilesContext,
} from "../../../components/AppDetailsRouters/SourceFilesLoading/SourceFilesContext";
import { SourceFilesVariant } from "../../../helpers/types/types";
import { renderIndexHtml } from "../../renderIndexHtml";
import { baseAppPath } from "../../../constants";
import "../../../components/Examples/styles/sc-ui.css";

export function renderPage(url: string, sourceFilesInfo: SourceFilesVariant = defaultSourceFilesVariant) {
    // Render the component to a string.
    const appHtml = ReactDOMServer.renderToString(
        <SourceFilesContext.Provider value={sourceFilesInfo}>
            <StaticRouter basename={baseAppPath} location={url}>
                <App />
            </StaticRouter>
        </SourceFilesContext.Provider>
    );

    // SEO tags
    const helmet = Helmet.renderStatic();

    return renderIndexHtml(appHtml, helmet, sourceFilesInfo);
}
