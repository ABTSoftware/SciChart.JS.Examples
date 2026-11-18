const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../tsconfig.node.json"),
    transpileOnly: true,
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});
const { createModuleLoader, createCompiler } = require("./moduleLoader.ts");

// Fake "compile": files are already CommonJS in these tests.
const loaderFor = (files, extra = {}) => {
    const styles = [];
    const loader = createModuleLoader({
        files: Object.entries(files).map(([name, content]) => ({ name, content })),
        compile: (file) => file.content,
        externals: { react: { marker: "react" }, scichart: { SciChartSurface: "surface" } },
        deepModules: { "scichart/deep/Only": { Only: 1 } },
        onStyle: (file) => styles.push(file.name),
        ...extra,
    });
    return { loader, styles };
};

// relative resolution with extensions, index files and ..
{
    const { loader } = loaderFor({
        "src/a.ts": 'exports.value = require("./b").value + require("./lib").value + require("../src/c.tsx").value;',
        "src/b.ts": "exports.value = 1;",
        "src/lib/index.ts": "exports.value = 10;",
        "src/c.tsx": "exports.value = 100;",
    });
    assert.equal(loader.require("src/a.ts").value, 111);
}

// each module evaluates once per loader; circular imports see partial exports
{
    const { loader } = loaderFor({
        "src/a.ts": 'exports.early = 1; const b = require("./b"); exports.fromB = b.sawA;',
        "src/b.ts": 'const a = require("./a"); exports.sawA = a.early;',
    });
    assert.equal(loader.require("src/a.ts").fromB, 1);
}

// bare imports come from externals; deep scichart imports fall back to the root package
{
    const { loader } = loaderFor({
        "src/a.ts":
            'exports.r = require("react").marker; exports.s = require("scichart/Charting/Visuals/SciChartSurface").SciChartSurface; exports.d = require("scichart/deep/Only").Only;',
    });
    const exports = loader.require("src/a.ts");
    assert.deepEqual([exports.r, exports.s, exports.d], ["react", "surface", 1]);
}

// unknown package names the package and points to Download
{
    const { loader } = loaderFor({ "src/a.ts": 'require("date-fns");' });
    assert.throws(() => loader.require("src/a.ts"), (error) => {
        assert.match(error.message, /"date-fns"/);
        assert.match(error.message, /[Dd]ownload/);
        assert.equal(error.file, "src/a.ts");
        return true;
    });
}

// missing relative file
{
    const { loader } = loaderFor({ "src/a.ts": 'require("./nope");' });
    assert.throws(() => loader.require("src/a.ts"), /Cannot find module "\.\/nope"/);
}

// css goes to onStyle and exports nothing; runtime errors carry the file name
{
    const { loader, styles } = loaderFor({
        "src/a.ts": 'require("./s.css"); throw new Error("boom");',
        "src/s.css": "body{}",
    });
    assert.throws(() => loader.require("src/a.ts"), (error) => error.message === "boom" && error.file === "src/a.ts");
    assert.deepEqual(styles, ["src/s.css"]);
}

// compiler: unchanged files reuse output, changed files are recompiled
{
    let calls = 0;
    const compile = createCompiler((file) => (calls++, "// " + file.content));
    const file = { name: "src/a.ts", content: "x" };
    assert.equal(compile(file), "// x");
    assert.equal(compile({ ...file }), "// x");
    assert.equal(calls, 1);
    assert.equal(compile({ ...file, content: "y" }), "// y");
    assert.equal(calls, 2);
}

// Errors thrown later (timers, promises) can be traced to the run that created them via the script name.
{
    const loader = createModuleLoader({
        files: [{ name: "src/a.ts", content: 'exports.boom = () => { throw new Error("late"); };' }],
        compile: (file) => file.content,
        externals: {},
        onStyle() {},
        sourceUrlPrefix: "live-run-7/",
    });
    let stack = "";
    try { loader.require("src/a.ts").boom(); } catch (error) { stack = error.stack; }
    assert.match(stack, /live-run-7\/src\/a\.ts/);
}
console.log("moduleLoader tests passed");
