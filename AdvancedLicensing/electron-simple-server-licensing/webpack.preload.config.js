const path = require("path");

module.exports = {
  entry: "./src/preload.ts",
  target: "electron-preload",
  mode: "development",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions: [".ts", ".js"] },
  output: { filename: "preload.js", path: path.resolve(__dirname, "dist") },
};
