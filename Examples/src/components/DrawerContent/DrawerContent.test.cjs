const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../../tsconfig.node.json"),
    compilerOptions: { module: "commonjs", moduleResolution: "node", jsx: "react-jsx" },
});
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
for (const [file, component] of [
    ["../Search/Search.tsx", () => React.createElement("input", { "aria-label": "Search examples" })],
    ["../Navigation/Navigation.tsx", () => React.createElement("nav")],
]) {
    const id = require.resolve(file);
    require.cache[id] = { id, loaded: true, exports: { __esModule: true, default: component } };
}
const DrawerContent = require("./DrawerContent.tsx").default;
const mobile = renderToStaticMarkup(React.createElement(DrawerContent, { onClose: () => {} }));
assert.match(
    mobile,
    /<div class="sc-app-drawer-top"><input[^>]+\/><button[^>]+aria-label="Close navigation"/,
    "Mobile search and close button share a header row"
);
assert(!mobile.includes(">Close<"), "The close control uses an icon");
const desktop = renderToStaticMarkup(React.createElement(DrawerContent));
assert(!desktop.includes('aria-label="Close navigation"'), "Desktop navigation has no close button");
assert(desktop.includes('aria-label="Search examples"'), "Desktop search remains available");
const css = require("postcss").parse(
    require("node:fs").readFileSync(path.resolve(__dirname, "../Examples/styles/sc-app.css"), "utf8")
);
const declaration = (selector, property) => {
    let value;
    css.walkRules(selector, (rule) => rule.walkDecls(property, (decl) => (value = decl.value)));
    return value;
};
assert.equal(declaration(".sc-app-mobile-drawer", "width"), "80vw");
assert.equal(declaration(".sc-app-mobile-drawer", "inset"), "0 auto 0 0", "Mobile drawer opens on the left");
assert.equal(declaration(".sc-app-drawer-top", "display"), "flex");
assert.equal(declaration(".sc-app-drawer-top", "padding"), "1rem");
console.log("Drawer header shows the close icon beside search only on mobile");
