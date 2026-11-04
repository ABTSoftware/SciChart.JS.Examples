// Open the app, then run: playwright-cli run-code "$(cat scripts/checkDemoNavigation.playwright.js)"
async (page) => {
    const currentUrl = new URL(page.url());
    const base = currentUrl.pathname.startsWith("/demo/") ? "/demo" : "";
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${currentUrl.origin}${base}/react/pie-chart`);
    const toggle = page.locator(".sc-app-details-nav-toggle");
    const expectOpen = async (expected) => {
        if ((await toggle.getAttribute("aria-expanded")) !== String(expected)) {
            throw new Error(`Navigation should remain ${expected ? "open" : "closed"}`);
        }
    };
    await expectOpen(true);
    await page.evaluate(() => {
        window.navigationTestMarker = true;
    });
    await page.locator('#EXAMPLE_NAVIGATION a[title="React Donut Chart"]').dispatchEvent("click");
    await page.waitForURL("**/react/donut-chart");
    await expectOpen(true);
    if (!(await page.evaluate(() => window.navigationTestMarker))) throw new Error("Demo link reloaded the document");
    await page.setViewportSize({ width: 800, height: 900 });
    await expectOpen(true);
    await page.locator('#EXAMPLE_NAVIGATION a[title="React Pie Chart"]').dispatchEvent("click");
    await page.waitForURL("**/react/pie-chart");
    await expectOpen(true);
    await page.setViewportSize({ width: 1440, height: 900 });
    await toggle.click();
    await expectOpen(false);
    await page.locator("a.sc-gallery-card").first().click();
    await page.waitForURL((url) => !url.pathname.endsWith("/pie-chart"));
    await expectOpen(false);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expectOpen(false);
}
