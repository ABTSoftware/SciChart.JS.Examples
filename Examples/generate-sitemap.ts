import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import * as fs from "fs";
import { PAGES } from "./src/components/AppRouter/pages";
import { EXAMPLES_PAGES } from "./src/components/AppRouter/examplePages";

enum EChangeFreq {
    Always = "always",
    Hourly = "hourly",
    Daily = "daily",
    Weekly = "weekly",
    Monthly = "monthly",
    Yearly = "yearly",
    Never = "never"
}

type TLink = {
    url: string;
    changefreq: EChangeFreq;
    priority: number;
};

const basePath = "https://demo.scichart.com";

(async () => {
    // An array with your links
    // const links = [{ url: "/page-1/", changefreq: "daily", priority: 0.3 }];
    const links: TLink[] = [];

    // Add pages links
    Object.values(PAGES).forEach(el => {
        links.push({
            url: `${basePath}${el.path}`,
            changefreq: EChangeFreq.Weekly,
            priority: 1
        });
    });

    // Add examples links
    Object.values(EXAMPLES_PAGES).forEach(el => {
        links.push({
            url: `${basePath}${el.path}`,
            changefreq: EChangeFreq.Weekly,
            priority: 0.5
        });
    });

    // Create a stream to write to
    const stream = new SitemapStream({ hostname: "https://..." });

    // Return a promise that resolves with your XML string
    const data = await streamToPromise(Readable.from(links).pipe(stream));
    const xmlStringResult = data.toString();
    fs.writeFile("sitemap.xml", xmlStringResult, err => {
        if (err) console.log(err);
        console.log("sitemap.xml is successfully written to file.");
    });
})();
