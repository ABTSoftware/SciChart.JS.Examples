const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" },
        { from: "node_modules/scichart/_wasm/scichart.wasm", to: "" },
        // This one also needed to work in browsers without SIMD support
        { from: "node_modules/scichart/_wasm/scichart-nosimd.wasm", to: "" },
        // Optional: if including 3D charts copy these files
      ],
    }),
  ],
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
};
