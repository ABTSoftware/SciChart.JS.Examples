// Run against the local dev server with: playwright-cli run-code "$(cat scripts/checkDetailsLayout.playwright.js)"
async (page) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:8080/react/pie-chart");
    const toggle = page.locator(".sc-app-details-nav-toggle");
    const expectLayout = async (sideBySide) => {
        await page.waitForFunction((expected) => {
            const layout = document.querySelector(".sc-app-chart-code");
            return layout && (getComputedStyle(layout).display === "grid") === expected;
        }, sideBySide);
        const compactHeader = await page.locator(".sc-app-details-header").evaluate((header) => {
            const row = header.querySelector(".sc-app-details-breadcrumb-row").getBoundingClientRect();
            const title = header.querySelector("h1").getBoundingClientRect();
            const subtitle = header.querySelector(".sc-content-subtitle").getBoundingClientRect();
            const gap = parseFloat(getComputedStyle(header).gap);
            return gap <= 8 && Math.abs(title.top - row.bottom - gap) < 1 &&
                Math.abs(subtitle.top - title.bottom - gap) < 1;
        });
        if (!compactHeader) throw new Error("Header spacing exceeds its compact gap");
        const buttonsVisible = await page.locator(".sc-app-layout-buttons").isVisible();
        if (buttonsVisible !== sideBySide) throw new Error("Layout controls disagree with available width");
        const fits = await page.locator(".sc-app-chart-code").evaluate((layout) => {
            const chart = layout.querySelector(".sc-app-example-root").getBoundingClientRect();
            const code = layout.querySelector(".sc-editor-code").getBoundingClientRect();
            return layout.scrollWidth <= layout.clientWidth + 1 && chart.width > 0 && code.width > 0;
        });
        if (!fits) throw new Error("Chart/code overflow or have no width");
    };
    await page.waitForFunction(() => document.querySelector(".sc-editor-code"));
    await expectLayout(false);
    await toggle.click();
    await expectLayout(true);
    // A deliberate stacked layout remains available even when both panels fit.
    await page.locator(".sc-app-layout-buttons li").nth(1).click();
    await page.waitForFunction(() => document.querySelector(".sc-app-chart-code-stacked"));
    await page.locator(".sc-app-layout-buttons li").first().click();
    await expectLayout(true);
    await toggle.click();
    await expectLayout(false);
    await page.setViewportSize({ width: 1680, height: 950 });
    await expectLayout(false);
    await toggle.click();
    await expectLayout(true);
    await toggle.click();
    await expectLayout(false);
    await page.setViewportSize({ width: 1280, height: 800 });
    await toggle.click();
    await expectLayout(true);
    await page.setViewportSize({ width: 1100, height: 800 });
    await expectLayout(false);
    await page.setViewportSize({ width: 390, height: 844 });
    await expectLayout(false);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await toggle.click();
    await expectLayout(true);
}
