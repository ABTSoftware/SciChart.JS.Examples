const path = require("path");

module.exports = {
  entry: "./src/server.ts",
  mode: "development",
  target: "node",
  externalsPresets: { node: true },
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  output: { filename: "server.js", path: path.resolve(__dirname, "dist") },
};
