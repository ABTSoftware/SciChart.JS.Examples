const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  name: "server",
  target: "node",
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  // Prevent webpack trying to build these
  externals: {
    express: "commonjs2 express",
    "ffi-napi": "commonjs2 ffi-napi",
    "ref-napi": "commonjs2 ref-napi",
  },
  entry: "./src/server/server.ts",
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "build"),
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
  plugins: [
    new CopyPlugin({
      // Copy the appropriate native binary for your platform
      patterns: [{ from: "src/runtimes/win-x64/native", to: "" }],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  node: {
    __dirname: false,
  },
};
