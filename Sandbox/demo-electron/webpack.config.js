const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  output: {
    filename: "bundle.js"
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "node_modules/scichart/_wasm/scichart2d.data", to: "scichart2d.data" },
        { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "node_modules/scichart/_wasm/" }
      ],
    })
  ],
};
