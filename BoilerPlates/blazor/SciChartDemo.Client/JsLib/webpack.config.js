const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: {
    demo: "./src/demo.js",
    sciChart: "./src/wrapper.js",
  },
  module: {
    rules: [],
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    path: path.resolve(__dirname, "../wwwroot"),
    filename: "[name].js",
    library: "[name]",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
      ],
    }),
  ],
};
