// Open the production app, then run: playwright-cli run-code "$(cat scripts/checkSandboxEditors.playwright.js)"
async (page) => {
    const currentUrl = new URL(page.url());
    const base = currentUrl.pathname.startsWith("/demo/") ? "/demo" : "";
    const exampleUrl = `${currentUrl.origin}${base}/react/pie-chart`;
    const response = await page.goto(exampleUrl);
    if (
        response.headers()["cross-origin-opener-policy"] !== "same-origin" ||
        response.headers()["cross-origin-embedder-policy"] !== "credentialless" ||
        !(await page.evaluate(() => crossOriginIsolated))
    ) {
        throw new Error("App must be cross-origin isolated for StackBlitz Node projects");
    }
    const warnings = [];
    const onConsole = (message) => warnings.push(message.text());
    page.on("console", onConsole);
    try {
        await page.getByTitle("Edit React Pie Chart in StackBlitz", { exact: true }).click();
        const editor = page.locator("iframe#stackblitz-container");
        await editor.waitFor();
        if (!(await editor.getAttribute("allow")).includes("cross-origin-isolated")) {
            throw new Error("StackBlitz iframe lacks isolation permission");
        }
        await page.waitForFunction(() => !document.querySelector(".sc-editor-loader-container"));
        const frame = page.frames().find((frame) => frame.url().includes("stackblitz.com"));
        if (!frame || !new URL(frame.url()).searchParams.has("corp")) {
            throw new Error("StackBlitz embed did not request isolation");
        }
        await frame.getByText("App.tsx", { exact: true }).first().waitFor({ state: "attached" });
        if ((await frame.locator("body").innerText()).includes("Unable to run Embedded Project")) {
            throw new Error("StackBlitz preview cannot run");
        }
        if (warnings.some((text) => text.includes("Invalid project.dependencies"))) {
            throw new Error("Invalid StackBlitz Node project payload");
        }
    } finally {
        page.off("console", onConsole);
    }
    await page.goto(exampleUrl);
    const apiResponse = page.waitForResponse((response) => response.url().includes("/api/sandboxurl/"));
    await page.getByTitle("Edit React Pie Chart in CodeSandbox", { exact: true }).click();
    const sandbox = await apiResponse;
    const data = await sandbox.json();
    if (!sandbox.ok() || !data.id) throw new Error(`CodeSandbox creation failed: ${sandbox.status()}`);
    const editor = page.locator('iframe[title="CodeSandbox"]');
    await editor.waitFor();
    if (!(await editor.getAttribute("src")).includes(`/embed/${data.id}`)) {
        throw new Error("CodeSandbox iframe does not use the created sandbox");
    }
    if (!(await editor.evaluate((frame) => frame.hasAttribute("credentialless")))) {
        throw new Error("CodeSandbox embed must load inside the isolated app");
    }
    await page.waitForFunction(() => !document.querySelector(".sc-editor-loader-container"));
    const preview =
        page.frames().find((frame) => frame.url().includes(`${data.id}.csb.app`)) ??
        (await page.waitForEvent("framenavigated", {
            predicate: (frame) => frame.url().includes(`${data.id}.csb.app`),
            timeout: 30000,
        }));
    await preview.locator("canvas").waitFor({ timeout: 30000 });
}
