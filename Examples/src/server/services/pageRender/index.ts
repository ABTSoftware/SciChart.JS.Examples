import { EXAMPLES_PAGES } from "../../../components/AppRouter/examplePages";
import { baseAppPath } from "../../../constants";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkParametrization";
import { getCachedSourceFiles } from "../../renderCodeSandboxRedirect";
import { renderPage } from "./reactSsr";

const pageHtmlCache = new Map<string, string>();

export function handleRender(url: string) {
    const cachedPageHtml = pageHtmlCache.get(url);
    if (cachedPageHtml) {
        return cachedPageHtml;
    } else {
        console.warn("render on demand", url);
        const pageHtml = renderPage(url);
        return pageHtml;
    }
}
export function populatePrerenderedPageCache() {
    for (let framework of Object.values(EPageFramework)) {
        // generate homepage
        const url = `${baseAppPath}/${framework}`;
        const pageHtml = renderPage(url);
        pageHtmlCache.set(url, pageHtml);

        // generate example pages
        for (let key in EXAMPLES_PAGES) {
            const exampleRoute = EXAMPLES_PAGES[key].path;
            const url = `${baseAppPath}/${framework}/${exampleRoute}`;
            const sourceFileInfo = getCachedSourceFiles(key, framework);
            const pageHtml = renderPage(url, sourceFileInfo);
            pageHtmlCache.set(url, pageHtml);

            const iFrameUrl = `${baseAppPath}/iframe/${exampleRoute}`;
            const fullScreenExampleHtml = renderPage(iFrameUrl, sourceFileInfo);
            pageHtmlCache.set(iFrameUrl, fullScreenExampleHtml);
        }
    }
}
