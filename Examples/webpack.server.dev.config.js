const path = require("path");
const webpackServerConfig = require("./webpack.server.config.js");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
    ...webpackServerConfig,
    mode: "development",
    devtool: "cheap-module-source-map",
    cache: {
        type: "filesystem",
        name: "server",
        maxMemoryGenerations: 1,
        buildDependencies: {
            config: [
                __filename,
                require.resolve("./webpack.server.config.js"),
                require.resolve("./tsconfig.server.json"),
                require.resolve("./tsconfig.base.json"),
                require.resolve("./tsconfig.json"),
            ],
        },
    },
    module: {
        rules: webpackServerConfig.module.rules.map((rule) =>
            String(rule.test) === String(/\.tsx?$/)
                ? {
                      ...rule,
                      use: {
                          loader: "ts-loader",
                          options: {
                              configFile: "tsconfig.server.json",
                              transpileOnly: true,
                          },
                      },
                  }
                : rule
        ),
    },
    plugins: [
        ...webpackServerConfig.plugins,
        new NodemonPlugin({
            script: "./build/server.js",
            watch: path.resolve("./src/server"),
            ext: "js,ts,tsx",
            nodeArgs: ["--inspect=9229"], // Added explicit debug args
        }),
    ],
    watch: true,
};
