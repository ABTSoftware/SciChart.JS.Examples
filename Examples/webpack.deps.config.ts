import { Configuration } from "webpack";
const path = require("path");

module.exports = (env: any, argv: any) => {
    const conf: Configuration = {
        mode: "production",
        entry: {
            exampleDependencies: [`./node_modules/scichart-example-dependencies/lib/index.js`],
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: argv.mode === "production" ? `[name].browser.js` : `[name].browser.dev.js`,
            library: "SciChartExampleDependencies",
            libraryExport: "default",
            libraryTarget: "global",
            globalObject: "self",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };

    if (argv.mode !== "production") {
        // @ts-ignore
        conf.devtool = "inline-source-map";
    }

    const esmConfig: Configuration = {
        ...conf,
        experiments: {
            outputModule: true,
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: argv.mode === "production" ? `[name].browser.mjs` : `[name].browser.dev.mjs`,
            globalObject: "self",
            libraryTarget: "module",
        },
    };

    return [esmConfig, conf];
};

module.exports.parallelism = 1;
