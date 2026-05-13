const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  output: { filename: "bundle.js", path: path.resolve(__dirname, "wwwroot") },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "node_modules/scichart/_wasm", to: "." }],
    }),
  ],
};
