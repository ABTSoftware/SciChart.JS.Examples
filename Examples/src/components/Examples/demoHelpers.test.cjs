const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../..", "tsconfig.node.json"),
    preferTsExts: true,
    compilerOptions: { module: "commonjs", moduleResolution: "node", jsx: "react-jsx" },
});

// These controls only need DOM event delivery; chart drawing is stubbed at its public seam.
class Node extends EventTarget {
    children = [];
    attributes = new Map();
    className = "";
    classList = {
        add: (...names) => {
            this.className += " " + names.join(" ");
        },
    };
    constructor(tag) {
        super();
        this.tagName = tag;
    }
    append(...nodes) {
        this.children.push(...nodes);
    }
    replaceChildren(...nodes) {
        this.children = nodes;
    }
    setAttribute(name, value) {
        this.attributes.set(name, value);
    }
    getAttribute(name) {
        return this.attributes.get(name);
    }
    set textContent(value) {
        this.children = [];
        this.text = value;
    }
    get textContent() {
        return this.text ?? this.children.map((node) => node.textContent).join("");
    }
    click() {
        this.dispatchEvent(new Event("click"));
    }
    find(tag) {
        return (
            this.children.find((node) => node.tagName === tag) ??
            this.children.map((node) => node.find?.(tag)).find(Boolean)
        );
    }
}
global.document = { createElement: (tag) => new Node(tag), createElementNS: (_namespace, tag) => new Node(tag) };

const main = async () => {
    const { createChartTheme, appTheme } = require("./theme.ts");
    const theme = createChartTheme({ sciChartBackground: "transparent" });
    assert.equal(theme.sciChartBackground, "transparent");
    assert.equal(Object.getPrototypeOf(theme), Object.getPrototypeOf(appTheme.SciChartJsTheme));
    assert.notEqual(
        appTheme.SciChartJsTheme.sciChartBackground,
        "transparent",
        "Legend overrides do not change the shared theme"
    );
    const React = require("react");
    const { renderToStaticMarkup } = require("react-dom/server");
    const reactIcons = require("./icons/index.tsx");
    const nativeIcons = require("./icons/native.ts");
    const shapes = (markup) =>
        (markup.match(/<(?:path|circle)\b[^>]*>/g) ?? []).map((tag) =>
            tag.replace(/\s+/g, " ").replace(/\s*\/?\s*>$/, ">")
        );
    for (const [name, Icon] of Object.entries(reactIcons)) {
        assert.deepEqual(
            shapes(nativeIcons[name]().innerHTML),
            shapes(renderToStaticMarkup(React.createElement(Icon))),
            `${name}: Native and React SVGs match`
        );
    }
    const calls = [];
    const drawPath = require.resolve("./FeaturedApps/ScientificCharts/PhasorDiagramChart/drawExample.ts");
    require.cache[drawPath] = {
        id: drawPath,
        loaded: true,
        exports: {
            drawExample: async () => ({
                sciChartSurface: { delete: () => calls.push("delete") },
                controls: { startAnimation: () => calls.push("start"), stopAnimation: () => calls.push("stop") },
            }),
        },
    };
    const { createExample } = require("./FeaturedApps/ScientificCharts/PhasorDiagramChart/createExample.ts");
    const root = new Node("div");
    const demo = createExample(root);
    await demo.ready;
    const toggle = root.find("button");
    assert.equal(toggle.getAttribute("aria-label"), "Stop rotation");
    assert(toggle.find("svg"), "Icon buttons contain a native SVG");
    toggle.click();
    assert.equal(toggle.getAttribute("aria-label"), "Start rotation");
    assert.equal(toggle.getAttribute("aria-pressed"), "false");
    toggle.click();
    assert.equal(toggle.getAttribute("aria-label"), "Stop rotation");
    demo.dispose();
    demo.dispose();
    assert.deepEqual(calls, ["stop", "start", "stop", "delete"], "Stop before deleting, exactly once");

    const { Demo, element } = require("./demoHelpers.ts");
    const first = element("div", root);
    const second = element("div", root);
    assert(
        first.id && second.id && first.id !== second.id,
        "Multiple charts and overviews have distinct destination IDs"
    );
    let resolve;
    const delayed = new Promise((done) => {
        resolve = done;
    });
    const disposed = [];
    const pending = new Demo(new Node("div"), async (child) => {
        await child.chart(
            () => delayed,
            child.root,
            "",
            (result) => result.controls.stopUpdate()
        );
        disposed.push("continued after disposal");
    });
    await Promise.resolve();
    pending.dispose();
    resolve({
        sciChartSurface: { delete: () => disposed.push("delete") },
        controls: { stopUpdate: () => disposed.push("stop") },
    });
    await assert.rejects(pending.ready, { name: "AbortError" });
    assert.deepEqual(disposed, ["stop", "delete"]);
    console.log("Native icon controls, pause/resume, ordered cleanup and disposal during async initialization pass");
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
