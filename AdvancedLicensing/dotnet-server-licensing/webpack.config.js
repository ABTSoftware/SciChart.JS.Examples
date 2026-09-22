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
        // SciChart 6 serves a DIRECTORY, not the old scichart2d.data/.wasm pair: _wasm/
        // holds the core binary plus its nosimd and wasm64 variants, and the same three
        // for charting3d. Copying the whole directory means new variants ship without
        // touching this config. Matches the other samples here.
        { from: "node_modules/scichart/_wasm", to: "." },
      ],
    }),
  ],
};
