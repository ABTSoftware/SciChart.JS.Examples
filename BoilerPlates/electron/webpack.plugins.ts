import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [
      { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
      { from: "node_modules/scichart/_wasm/scichart2d-nosimd.wasm", to: "" },
      { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
      { from: "node_modules/scichart/_wasm/scichart3d-nosimd.wasm", to: "" },
    ],
  }),
];
