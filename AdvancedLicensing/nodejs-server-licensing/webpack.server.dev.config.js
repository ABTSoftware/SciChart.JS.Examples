const { merge } = require("webpack-merge");
const path = require("path");
const webpackServerConfig = require("./webpack.server.config.js");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = merge(webpackServerConfig, {
  mode: "development",
  plugins: [
    new NodemonPlugin({
      script: "./build/server.js",
      watch: path.resolve("./src/server"),
      ext: "js,ts",
    }),
  ],
  watch: true,
});
