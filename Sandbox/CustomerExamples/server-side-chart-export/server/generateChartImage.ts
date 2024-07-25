import puppeteer, { PDFOptions } from "puppeteer";

export const generateChart = async (pageUrl: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(pageUrl);

    // allow chart to fully render before taking a screenshot
    const chartElement = await page.waitForSelector(".rendered");

    const image = await chartElement!.screenshot();
    browser.close();
    return image;
};

export const generatePdf = async (pageUrl: string) => {
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: {
            width: 2000,
            height: 1000,
            deviceScaleFactor: 4 // scichart will automatically scale the canvas buffer size accordingly to the page zoom value
        }
    });
    const page = await browser.newPage();

    await page.goto(pageUrl);
    // allow chart to fully render before taking a screenshot
    const chartElement = await page.waitForSelector(".rendered");

    const options: PDFOptions = {
        scale: 2 // default 1
    };
    const pdfFile = await page.pdf(options);

    browser.close();
    return pdfFile;
};
