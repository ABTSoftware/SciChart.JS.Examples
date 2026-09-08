import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [
      // Forge's webpack plugin emits the renderer entry point into a subfolder
      // named after it, so the wasm has to sit next to index.html to be found.
      { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "main_window" },
      {
        from: "node_modules/scichart/_wasm/scichart2d-nosimd.wasm",
        to: "main_window",
      },
      { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "main_window" },
      {
        from: "node_modules/scichart/_wasm/scichart3d-nosimd.wasm",
        to: "main_window",
      },
    ],
  }),
];
