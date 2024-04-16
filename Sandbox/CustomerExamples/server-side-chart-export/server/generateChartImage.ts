import puppeteer from "puppeteer";

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
