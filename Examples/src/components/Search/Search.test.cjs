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
const { filterSearchItems, generateSearchItems, getTitleSearchParts } = require("./searchItems.ts");
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

const ranked = [
    { title: "Descriptive demo", content: "Spider chart", link: "/description" },
    { title: "Radar Chart", alsoKnownAs: "Spider chart", link: "/alias" },
    { title: "Spider Chart", link: "/title" },
    { title: "Spder Chart", link: "/fuzzy-title" },
    { title: "Keyword demo", keywords: "spider chart", link: "/keywords" },
];
assert.deepEqual(
    filterSearchItems(ranked, "spider chart"),
    [ranked[2], ranked[3], ranked[1], ranked[0], ranked[4]],
    "Even fuzzy titles outrank aliases, which outrank descriptions and keywords"
);
assert.deepEqual(filterSearchItems(ranked, "radar spider"), [ranked[1]], "Words can span title and aliases");
assert.deepEqual(filterSearchItems(ranked, "descriptive spider"), [ranked[0]], "Words can span title and content");
assert.deepEqual(filterSearchItems(ranked, "spider violin"), [], "Every word must still match across all fields");
assert.deepEqual(filterSearchItems(ranked, "spidr chart"), [ranked[2], ranked[1], ranked[0], ranked[4]]);

const richMenu = [
    {
        title: "Polar charts",
        submenu: [
            {
                title: (name) => `${name} Radar Chart`,
                path: "radar-chart",
                alsoKnownAs: "**Kíviat** plot",
                description: "Compare sorting algorithms",
                subtitle: (name) => `${name} scalability demo`,
                metaDescription: (name) => `${name} stability visualization`,
                markdownContent: (name) => `## ${name} cache efficiency`,
                metaKeywords: "polygon",
            },
        ],
    },
];
for (const [framework, name] of [
    ["react", "React"],
    ["angular", "Angular"],
    ["javascript", "JavaScript"],
]) {
    const items = generateSearchItems(richMenu, framework);
    for (const query of ["kiviat", "sorting algorithms", "scalability", "stability", "cache efficiency", "polygon"]) {
        assert.deepEqual(filterSearchItems(items, query), items, `${query} searches metadata in ${framework}`);
    }
    assert(items[0].content.includes(`${name} scalability`));
    assert(items[0].content.includes(`${name} stability`));
    assert(items[0].content.includes(`${name} cache efficiency`));
    assert.equal(items[0].link, `/${framework}/radar-chart`);
}
console.log(
    "Search includes aliases, descriptions, meta descriptions, markdown and keywords in strict relevance tiers"
);

assert.deepEqual(getTitleSearchParts("Realtime React Chart Performance Demo", "prformance"), [
    { text: "Realtime React Chart ", matched: false },
    { text: "Performance", matched: true },
    { text: " Demo", matched: false },
]);
assert.deepEqual(getTitleSearchParts("React Chart", "ACT char"), [
    { text: "Re", matched: false },
    { text: "act", matched: true },
    { text: " ", matched: false },
    { text: "Char", matched: true },
    { text: "t", matched: false },
]);
for (const title of ["Café Chart", "Cafe\u0301 Chart", "Chart Chart", "📈 Chart", "A < B & C"]) {
    for (const query of ["cafe", "chart", "", "   ", "***", "xy", "web chart"]) {
        const parts = getTitleSearchParts(title, query);
        assert.equal(parts.map((part) => part.text).join(""), title, "Highlighting preserves the title exactly");
    }
}
for (const title of ["Café Chart", "Cafe\u0301 Chart"]) {
    assert.deepEqual(getTitleSearchParts(title, "cafe"), [
        { text: title.slice(0, -6), matched: true },
        { text: " Chart", matched: false },
    ]);
}
assert.deepEqual(getTitleSearchParts("Radar Plot", "spider"), [{ text: "Radar Plot", matched: false }]);
assert.deepEqual(getTitleSearchParts("Chart Chart", "chart"), [
    { text: "Chart", matched: true },
    { text: " ", matched: false },
    { text: "Chart", matched: true },
]);
assert.deepEqual(getTitleSearchParts("Banana", "ana nan"), [
    { text: "B", matched: false },
    { text: "anana", matched: true },
]);
assert.deepEqual(getTitleSearchParts("React Chart", "***"), [{ text: "React Chart", matched: false }]);
console.log("Title highlighting handles partial, fuzzy, repeated and accented matches without changing title text");
