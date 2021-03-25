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
    Never = "never",
}

type TLink = {
    url: string;
    changefreq: EChangeFreq;
    priority: number;
    lastmod: string;
    img?: { url: string; }[]
};

const basePath = "https://demo.scichart.com";

(async () => {
    // An array with your links
    // const links = [{ url: "/page-1/", changefreq: "daily", priority: 0.3 }];
    const links: TLink[] = [];
    const dateNow = new Date().toISOString();
    const lastmod = dateNow.substring(0, 10);

    // Add pages links
    Object.values(PAGES).forEach((el) => {
        links.push({
            url: el.path,
            changefreq: EChangeFreq.Weekly,
            priority: 1,
            lastmod,
        });
    });

    // Add examples links
    Object.values(EXAMPLES_PAGES).forEach((el) => {
        if (el.thumbnailImage) {
            links.push({
                url: el.path,
                changefreq: EChangeFreq.Weekly,
                priority: 0.5,
                lastmod,
                img: [{url: `/images/${el.thumbnailImage}`}]
            });
        } else {
            links.push({
                url: el.path,
                changefreq: EChangeFreq.Weekly,
                priority: 0.5,
                lastmod
            });
        }
    });

    // Create a stream to write to
    const stream = new SitemapStream({
        hostname: basePath,
        lastmodDateOnly: true,
        xmlns: {
            // trim the xml namespace
            news: false, // flip to false to omit the xml namespace for news
            xhtml: false,
            image: true,
            video: false,
            custom: [
                'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"',
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ],
        },
    });

    // Return a promise that resolves with your XML string
    const data = await streamToPromise(Readable.from(links).pipe(stream));
    const xmlStringResult = data.toString();
    fs.writeFile("sitemap.xml", xmlStringResult, (err) => {
        if (err) console.log(err);
        console.log("sitemap.xml is successfully written to file.");
    });
})();
