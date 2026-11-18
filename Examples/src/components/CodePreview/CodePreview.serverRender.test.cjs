// The server-rendered HTML must keep the example's source in <pre><code> for crawlers, with live editing on or off.
const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../../tsconfig.node.json"),
    transpileOnly: true,
    compilerOptions: { module: "commonjs", moduleResolution: "node", jsx: "react-jsx" },
});
const React = require("react");
const { renderToString } = require("react-dom/server");
const { MemoryRouter } = require("react-router");
const stub = (request, exports) => {
    const id = require.resolve(request, { paths: [__dirname] });
    require.cache[id] = { id, loaded: true, exports: { __esModule: true, ...exports } };
};
// The highlighter ships as ESM; a stand-in with the same markup contract (<pre><code>text</code></pre>) is enough here.
const Highlighter = ({ children }) => React.createElement("pre", null, React.createElement("code", null, children));
Highlighter.registerLanguage = () => {};
stub("react-syntax-highlighter/dist/esm/light", { default: Highlighter });
for (const language of ["typescript", "javascript", "css", "json", "xml"]) stub(`react-syntax-highlighter/dist/esm/languages/hljs/${language}`, { default: {} });
stub("react-syntax-highlighter/dist/esm/styles/hljs/dark", {});
stub("../../helpers/shared/Helpers/Context", { _useContext: () => ({ state: { theme: "navy" } }) });
stub("../../helpers/shared/Helpers/frameworkParametrization", {
    EPageFramework: { React: "react", Vanilla: "javascript", Angular: "angular" },
    FRAMEWORK_NAME: { react: "React", javascript: "JavaScript", angular: "Angular" },
});
const { CodePreview } = require("./CodePreview.tsx");

const files = [
    { name: "src/drawExample.ts", content: "export const drawExample = async () => { /* UNIQUE_MARKER */ };" },
    { name: "src/App.tsx", content: "export default function App() {}" },
    { name: "package.json", content: "{}" },
];
const live = { availability: "available", autoRun: true, onAutoRunChange() {}, onRun() {}, onPrepare() {} };
for (const props of [{}, { live }, { live: { ...live, availability: "angular" } }]) {
    const html = renderToString(
        React.createElement(MemoryRouter, null, React.createElement(CodePreview, { files, framework: "react", examplePath: "x", ...props }))
    );
    assert.match(html, /<pre[^>]*><code[^>]*>[^<]*UNIQUE_MARKER[^<]*<\/code><\/pre>/, "drawExample source is in <pre><code>: " + JSON.stringify(Object.keys(props)));
    assert(!html.includes("cm-editor") && !html.includes("<textarea"), "no editor is rendered on the server");
}
console.log("CodePreview server render tests passed");
