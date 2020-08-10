const { merge } = require("webpack-merge");
const webpackServerConfig = require("./webpack.server.config.js");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = merge(webpackServerConfig, {
    mode: "development",
    plugins: [new NodemonPlugin()],
    watch: true
});
