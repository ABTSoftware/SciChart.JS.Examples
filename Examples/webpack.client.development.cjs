const path = require("path");
const webpack = require("webpack");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const reactRefresh = require("react-refresh-typescript").default;
const production = require("./webpack.client.config.js");

module.exports = {
    ...production,
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    cache: {
        type: "filesystem",
        maxMemoryGenerations: 1,
        buildDependencies: {
            config: [
                __filename,
                require.resolve("./webpack.client.config.js"),
                require.resolve("./webpack.assets.cjs"),
                require.resolve("./tsconfig.base.json"),
                require.resolve("./tsconfig.json"),
                require.resolve("./tsconfig.browser.json"),
                require.resolve("./scripts/refreshExamples.cjs"),
                require.resolve("./scripts/stripExampleMarkdown.cjs"),
            ],
        },
    },
    resolve: {
        ...production.resolve,
        fallback: { child_process: false, fs: false, crypto: false, net: false, tls: false },
    },
    // Compile chart imports on first use instead of building 181 charts for the gallery.
    experiments: { lazyCompilation: { entries: false, imports: true } },
    module: {
        rules: production.module.rules
            .map((rule) => {
                if (String(rule.test) === String(/\.tsx?$/))
                    return {
                        ...rule,
                        use: {
                            loader: "ts-loader",
                            options: {
                                configFile: "tsconfig.browser.json",
                                transpileOnly: true,
                                getCustomTransformers: () => ({ before: [reactRefresh()] }),
                            },
                        },
                    };
                if (String(rule.test) === String(/\.css$/) || String(rule.test) === String(/\.scss$/))
                    return {
                        ...rule,
                        use: rule.use.map((loader, i) => (i === 0 ? "style-loader" : loader)),
                    };
                return rule;
            })
            .concat([
                {
                    test: /\.tsx$/,
                    include: path.resolve(__dirname, "src/components/Examples"),
                    enforce: "pre",
                    loader: path.resolve(__dirname, "scripts/refreshExamples.cjs"),
                },
                {
                    test: /exampleInfo\.tsx?$/,
                    resourceQuery: { not: [/description/] },
                    enforce: "pre",
                    loader: path.resolve(__dirname, "scripts/stripExampleMarkdown.cjs"),
                },
            ]),
    },
    plugins: [new webpack.DefinePlugin({ __SCICHART_LAZY_EXAMPLES__: true }), new ReactRefreshPlugin()],
    devServer: { allowedHosts: "all", historyApiFallback: true, hot: true },
};
