import express = require("express");
var url = require("url");
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";
import { getTitle, EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";

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
    // TODO test
    const requestUrl = req.query["url"];
    const location = url.parse(requestUrl, true);
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === location.pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    const oEmbedResponse = new OEmbedResponse();
    oEmbedResponse.title = getTitle(currentExample.title, EPageFramework.Vanilla);
    oEmbedResponse.description = currentExample.previewDescription;
    oEmbedResponse.author_url = oEmbedResponse.provider_url + currentExample.path;
    oEmbedResponse.thumbnail_url = oEmbedResponse.provider_url + "/" + currentExample.thumbnailImage;
    res.send(oEmbedResponse);
});

export { router as oembed };
