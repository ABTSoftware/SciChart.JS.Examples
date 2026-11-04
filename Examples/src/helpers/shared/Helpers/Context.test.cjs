const assert = require("node:assert/strict");
const path = require("node:path");

require("ts-node").register({
    project: path.resolve(__dirname, "../../../..", "tsconfig.node.json"),
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});

// Supply catalog data without webpack's require.context or loading chart assets.
const example = { id: "line", path: "javascript-line-chart" };
const catalogPath = require.resolve("../../../components/AppRouter/examplePages.ts");
require.cache[catalogPath] = {
    id: catalogPath,
    filename: catalogPath,
    loaded: true,
    exports: { EXAMPLES_PAGES: { line: example } },
};

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { StaticRouter } = require("react-router");
const { StateProvider, useAppContext } = require("./Context.tsx");
const { FileExplorer } = require("../../../components/CodePreview/FileExplorer.tsx");
const { NavigationProvider, useNavigationContext } = require("../../../components/Navigation/NavigationContext.tsx");
const { ETheme } = require("../../types/types.ts");
const h = React.createElement;

function render(location, children) {
    return renderToStaticMarkup(h(StaticRouter, { basename: "/demo", location }, h(StateProvider, null, children)));
}

for (const framework of ["react", "angular", "javascript"]) {
    function Probe() {
        const { state, getNextTheme } = useAppContext();
        assert.equal(state.framework, framework);
        assert.equal(state.currentExample, example);
        assert.equal(state.isHomePage, false);
        assert.equal(state.is404, false);
        assert.equal(getNextTheme(ETheme.navy), ETheme.light);
        assert.equal(getNextTheme(ETheme.light), ETheme.dark);
        assert.equal(getNextTheme(ETheme.dark), ETheme.navy);
        return h(FileExplorer, { files: [], modifiedNames: new Set(), onSelect: () => {} });
    }
    const html = render(`/demo/${framework}/${example.path}`, h(Probe));
    for (const target of ["react", "angular", "javascript"]) {
        assert(html.includes(`href="/demo/${target}/${example.path}"`), html);
        assert(html.includes(`aria-label="Framework: ${target}"`));
    }
    for (const name of ["Vue", "Svelte"]) {
        assert.match(html, new RegExp(`<button[^>]*disabled=""[^>]*aria-label="${name} \\(coming soon\\)"`));
        assert(!html.includes(`href="/demo/${name.toLowerCase()}/`));
    }
    assert(html.indexOf('aria-label="Source framework"') < html.indexOf('role="tree"'));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
}

for (const [location, expected] of [
    ["/demo/angular", { framework: "angular", isHomePage: true, is404: false }],
    ["/demo/javascript-line-chart", { framework: "react", currentExample: example, is404: false }],
    ["/demo/iframe/javascript-line-chart", { framework: "javascript", currentExample: example, isIFrame: true }],
    ["/demo/missing-example", { is404: true }],
]) {
    render(
        location,
        h(() => {
            const { state } = useAppContext();
            for (const [key, value] of Object.entries(expected)) assert.equal(state[key], value);
            return null;
        })
    );
}

render(
    "/demo/react",
    h(
        NavigationProvider,
        { mostVisibleCategory: "category" },
        h(() => {
            const context = useNavigationContext();
            assert.equal(context.mostVisibleCategory, "category");
            assert.equal(context.isCategoryCollapsed("category"), true);
            assert.equal(typeof context.toggleCategory, "function");
            assert.equal(typeof context.expandCategory, "function");
            return null;
        })
    )
);
console.log("App context, framework links, and navigation context checks passed");
