import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [
      { from: "node_modules/scichart/_wasm/scichart.wasm", to: "" },
      { from: "node_modules/scichart/_wasm/scichart-nosimd.wasm", to: "" },
    ],
  }),
];
