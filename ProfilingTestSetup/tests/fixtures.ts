import { test as base } from "@playwright/test";
import path from "path";

export interface PageLoadMetrics {
    pageLoadStart: number;
    pageLoadEnd: number;
    pageLoadDuration: number;
    domReadyStart: number;
    domReadyEnd: number;
    domReadyDuration: number;
}

export const test = base.extend<{ forEachTest: void; pageLoadMetrics: PageLoadMetrics }>({
    pageLoadMetrics: async ({ page }, use) => {
        const metrics: PageLoadMetrics = {
            pageLoadStart: 0,
            pageLoadEnd: 0,
            pageLoadDuration: 0,
            domReadyStart: 0,
            domReadyEnd: 0,
            domReadyDuration: 0
        };

        await use(metrics);
    },
    forEachTest: [
        async ({ page, pageLoadMetrics }, use) => {
            // More detailed console log handling with type checking
            page.on("console", async msg => {
                const type = msg.type();
                const text = msg.text();
                const args = msg.args();
                const values = text;
                // const values = await Promise.all(args.map(arg => arg.jsonValue()));

                const typeMarker = `[${type.toUpperCase()}]`;
                // Handle different console types
                if (type === "error") {
                    console.error(typeMarker, values);
                } else if (type === "warning") {
                    console.warn(typeMarker, values);
                } else {
                    console.log(typeMarker, values);
                }
            });

            // Support both localhost (dev mode) and bundled file (test mode)
            // Set TEST_MODE=url to use localhost, otherwise uses bundled file
            const testMode = process.env.TEST_MODE || "file";

            let url: string;
            if (testMode === "url") {
                url = process.env.TEST_URL || "http://localhost:8080";
                // console.log(`Running test in DEV mode against: ${url}`);
            } else {
                const buildPath = path.resolve(__dirname, "../build/index.html");
                url = `file://${buildPath}`;
                // console.log(`Running test in BUNDLE mode against: ${url}`);
            }

            // Measure page load
            pageLoadMetrics.pageLoadStart = performance.now();
            await page.goto(url);
            pageLoadMetrics.pageLoadEnd = performance.now();
            pageLoadMetrics.pageLoadDuration =
                pageLoadMetrics.pageLoadEnd - pageLoadMetrics.pageLoadStart;

            // Measure DOM readiness
            pageLoadMetrics.domReadyStart = performance.now();
            await page.waitForSelector("#containerId");
            pageLoadMetrics.domReadyEnd = performance.now();
            pageLoadMetrics.domReadyDuration =
                pageLoadMetrics.domReadyEnd - pageLoadMetrics.domReadyStart;

            await use();
        },
        { auto: true }
    ] // automatically starts for every test.
});
