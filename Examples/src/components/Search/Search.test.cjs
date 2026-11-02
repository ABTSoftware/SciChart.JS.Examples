const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../..", "tsconfig.node.json"),
    compilerOptions: { module: "commonjs", moduleResolution: "node", jsx: "react-jsx" },
});
const examplesPath = require.resolve("../AppRouter/examples.ts");
const catalogPath = require.resolve("../AppRouter/examplePages.ts");
require.cache[catalogPath] = { id: catalogPath, loaded: true, exports: { EXAMPLES_PAGES: {} } };
require.cache[examplesPath] = { id: examplesPath, loaded: true, exports: { ALL_MENU_ITEMS: [] } };
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { StaticRouter } = require("react-router");
const { StateProvider } = require("../../helpers/shared/Helpers/Context.tsx");
const Search = require("./Search.tsx").default;
const html = renderToStaticMarkup(
    React.createElement(
        StaticRouter,
        { location: "/react" },
        React.createElement(StateProvider, null, React.createElement(Search))
    )
);
assert.match(html, /role="combobox"/, "Search exposes an accessible autocomplete, not a native datalist");
assert.match(html, /aria-autocomplete="list"/);
assert.match(html, /aria-expanded="false"/);
assert(!html.includes("<datalist"));
assert(html.includes('autoComplete="off"') || html.includes('autocomplete="off"'));
console.log("Search renders accessible autocomplete controls without native history suggestions");
const { filterSearchItems, generateSearchItems } = require("./searchItems.ts");
const fixtures = [
    { title: "React Column Chart", link: "/react/column-chart" },
    { title: "React Line Chart", link: "/react/line-chart" },
    { title: "Café chart", link: "/react/cafe-chart" },
];
assert.deepEqual(filterSearchItems(fixtures, "COLUMN"), [fixtures[0]]);
assert.deepEqual(filterSearchItems(fixtures, "chart"), fixtures);
assert.deepEqual(filterSearchItems(fixtures, "cafe"), [fixtures[2]]);
assert.deepEqual(filterSearchItems(fixtures, ""), fixtures);
assert.deepEqual(filterSearchItems(fixtures, "no such example"), []);
assert.deepEqual(
    fixtures.map((item) => item.title),
    ["React Column Chart", "React Line Chart", "Café chart"]
);
const menu = [
    {
        title: "Basic charts",
        submenu: [{ title: (framework) => `${framework} Line Chart`, path: "line-chart", metaKeywords: "line" }],
    },
];
for (const framework of ["react", "angular", "javascript"]) {
    const [item] = generateSearchItems(menu, framework);
    assert.equal(item.link, `/${framework}/line-chart`);
    assert.equal(item.category, "Basic charts");
    assert.equal(generateSearchItems([...menu, ...menu], framework).length, 1);
}
console.log("Search filters by title without case/diacritic restrictions and preserves framework routes");

assert.equal(filterSearchItems(fixtures, "colmn chart")[0], fixtures[0], "A missing letter still finds the demo");
for (const query of ["chart column", "CHART colmn", "colmun chart", "  chart   columm  "]) {
    assert.equal(filterSearchItems(fixtures, query)[0], fixtures[0], `${query} finds the column demo`);
}
assert.equal(filterSearchItems(fixtures, "lne chart")[0], fixtures[1], "Missing letters work in shorter words too");
assert.equal(filterSearchItems(fixtures, "chart cafe")[0], fixtures[2], "Reordered words retain accent handling");
const approximate = { title: "React Colmun Chart", link: "/react/typo" };
assert.equal(
    filterSearchItems([approximate, ...fixtures], "column chart")[0],
    fixtures[0],
    "Exact phrases outrank typos"
);
assert.equal(
    filterSearchItems([approximate, ...fixtures], "React Column Chart")[0],
    fixtures[0],
    "Exact titles rank first"
);
assert.deepEqual(filterSearchItems(fixtures, "column violin"), [], "Every query word must match");
assert.deepEqual(filterSearchItems(fixtures, "   "), fixtures);
assert.deepEqual(filterSearchItems(fixtures, "zzzz"), [], "Unrelated searches stay empty");
assert.deepEqual(filterSearchItems(fixtures, "xy"), [], "Very short queries do not match unrelated words fuzzily");
console.log("Fuzzy search handles missing/transposed letters, reordered words, ranking, and unrelated queries");
