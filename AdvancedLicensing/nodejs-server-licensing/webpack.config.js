const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" },
        // SciChart 6 serves a DIRECTORY, not the old scichart2d.data/.wasm pair: _wasm/
        // holds the core binary plus its nosimd and wasm64 variants, and the same three
        // for charting3d. Copying the whole directory means new variants ship without
        // touching this config.
        { from: "node_modules/scichart/_wasm", to: "" },
      ],
    }),
  ],
};
