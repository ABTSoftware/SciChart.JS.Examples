const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./client/index.ts",
  mode: "development",
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  output: {
    filename: "bundle.js",
    // Spring Boot serves static files from src/main/resources/static/
    path: path.resolve(__dirname, "src/main/resources/static"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "node_modules/scichart/_wasm", to: "." }],
    }),
  ],
};
