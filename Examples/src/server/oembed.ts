import express from "express";
import { parse as parseUrl } from "url";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";
import { getFrameworkContent, EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";

const router = express.Router();

class OEmbedResponse {
    type: "link";
    version: "1.0";
    title: string;
    author_name: string = "SciChart.js";
    author_url: string;
    provider_name: string = "SciChart.js Demo";
    provider_url: string = "https://demo.scichart.com";
    thumbnail_url: string;
    thumbnail_width: string = "900";
    thumbnail_height: string = "900";
    description: string;
    //html: string;
}

router.get("/", (req, res) => {
    const requestUrl = req.query["url"] as string;
    const location = parseUrl(requestUrl, true);
    const examplePath = (location.pathname as string).substring(location.pathname.lastIndexOf("/") + 1);
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === examplePath);
    if (currentExampleKey) {
        const currentExample = EXAMPLES_PAGES[currentExampleKey];
        const oEmbedResponse = new OEmbedResponse();
        oEmbedResponse.title = getFrameworkContent(currentExample.title, EPageFramework.Vanilla);
        oEmbedResponse.description = getFrameworkContent(currentExample.metaDescription, EPageFramework.Vanilla);
        oEmbedResponse.author_url = oEmbedResponse.provider_url + "/" + currentExample.path;
        oEmbedResponse.thumbnail_url = oEmbedResponse.provider_url + "/" + currentExample.thumbnailImage;
        res.send(oEmbedResponse);
    } else {
        res.status(404).send("Example not found");
    }
});

export { router as oembed };
