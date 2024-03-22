const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node-modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "wwwroot"),
    filename: "bundle.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
      ],
    }),
  ],
};
