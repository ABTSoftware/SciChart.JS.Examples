const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/renderer.ts",
  target: "web",
  mode: "development",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions: [".ts", ".js"] },
  output: { filename: "bundle.js", path: path.resolve(__dirname, "dist") },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "index.html", to: "." },
        { from: "node_modules/scichart/_wasm", to: "." },
      ],
    }),
  ],
};
