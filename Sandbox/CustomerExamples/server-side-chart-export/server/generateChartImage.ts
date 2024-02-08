import puppeteer from "puppeteer";

export const generateChart = async (pageUrl: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    console.log("pageUrl", pageUrl)
    await page.goto(pageUrl);

    const chartElement = await page.waitForSelector("#chart");
    // allow chart to fully render before taking a screenshot
    page.waitForTimeout(3000);
    const image = await chartElement!.screenshot();
    browser.close();
    return image;
};
