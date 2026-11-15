// Run against the dev server: playwright-cli run-code "$(cat scripts/checkExampleLayouts.playwright.js)"
async function checkExampleLayouts(page) {
    const origin = new URL(page.url()).origin;
    const examples = [
        "chart-websocket-bigdata-demo",
        "parallel-coordinates-chart",
        "datapoint-selection",
        "chart-title",
        "chart-legends",
        "polar-modifiers",
        "3d-styling-demo-chart",
    ];
    const fixture = await page.context().newPage();
    let checked = 0;
    try {
        for (const example of examples) {
            for (const framework of ["javascript", "angular", "react"]) {
                const response = await page.request.get(`${origin}/source/${example}?framework=${framework}`);
                if (!response.ok()) throw new Error(`${example} (${framework}): Export failed`);
                const project = await response.json();
                if (project.framework !== framework) throw new Error(`${example}: Unexpected framework fallback`);
                const files = Object.fromEntries(project.files.map((file) => [file.name, file.content]));
                const source = files["src/createExample.ts"];
                // Use the exported host classes; charts created by Demo.chart use its default classes.
                const hostClasses = source
                    ? source.match(/element\("div", root, "([^"]*)"\)/)?.[1] ??
                      files["src/demoHelpers.ts"].match(/className = "([^"]+)"/)?.[1]
                    : "";
                if (hostClasses === undefined) throw new Error(`${example}: Chart host classes not found`);
                // Isolate layout from WASM, networking and chart rendering.
                await fixture.setContent(`<style>body { margin: 0; } ${files["src/styles.css"]}</style>
                    <div class="sc-chart-wrapper sc-responsive-chart-wrapper" style="height: 800px;">
                        <div class="${hostClasses}"></div>
                        <aside class="sc-responsive-controls">Controls</aside>
                    </div>`);
                for (const width of [1440, 1024, 800, 601, 600, 390]) {
                    await fixture.setViewportSize({ width, height: 800 });
                    const layout = await fixture.locator(".sc-responsive-chart-wrapper").evaluate((root) => {
                        const chart = root.firstElementChild.getBoundingClientRect();
                        const controls = root.lastElementChild.getBoundingClientRect();
                        return {
                            width: root.clientWidth,
                            chart: {
                                width: chart.width,
                                height: chart.height,
                                right: chart.right,
                                bottom: chart.bottom,
                            },
                            controls: {
                                width: controls.width,
                                height: controls.height,
                                left: controls.left,
                                top: controls.top,
                            },
                            overflow: root.scrollWidth > root.clientWidth + 1,
                        };
                    });
                    const fits =
                        width > 600
                            ? Math.abs(layout.controls.width - Math.max(width * 0.3, 256)) <= 1 &&
                              Math.abs(layout.chart.right - layout.controls.left) <= 1
                            : Math.abs(layout.chart.width - width) <= 1 &&
                              Math.abs(layout.controls.width - width) <= 1 &&
                              Math.abs(layout.chart.height - 400) <= 1 &&
                              Math.abs(layout.controls.height - 400) <= 1 &&
                              Math.abs(layout.chart.bottom - layout.controls.top) <= 1;
                    if (!fits || layout.overflow) {
                        throw new Error(`${example} (${framework}, ${width}px): ${JSON.stringify(layout)}`);
                    }
                    checked++;
                }
            }
        }
    } finally {
        await fixture.close();
    }
    return `Validated ${checked} exported sidebar layouts across ${examples.length} demos and all three frameworks.`;
}
