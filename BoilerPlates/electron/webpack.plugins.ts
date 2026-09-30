import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [
      // electron-forge serves the renderer from .webpack/renderer/main_window,
      // so the wasm files have to sit next to that entry point's index.html
      { from: "node_modules/scichart/_wasm/", to: "main_window" },
    ],
  }),
];
