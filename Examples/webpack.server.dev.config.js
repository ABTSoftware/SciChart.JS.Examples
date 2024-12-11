const { merge } = require("webpack-merge");
const path = require("path");
const webpackServerConfig = require("./webpack.server.config.js");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = merge(webpackServerConfig, {
    mode: "development",
    devtool: "inline-source-map", // Changed from 'source-map' for better debugging
    plugins: [
        new NodemonPlugin({
            script: "./build/server.js",
            watch: path.resolve("./src/server"),
            ext: "js,ts,tsx",
            nodeArgs: ["--inspect=9229"], // Added explicit debug args
        }),
    ],
    watch: true,
});
