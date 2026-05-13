const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  target: "electron-main",
  mode: "development",
  externals: { electron: "commonjs2 electron" },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions: [".ts", ".js"] },
  output: { filename: "main.js", path: path.resolve(__dirname, "dist") },
};
