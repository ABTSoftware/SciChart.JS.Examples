import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require("copy-webpack-plugin");

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [{ from: "node_modules/scichart/_wasm/scichart.wasm", to: "" }],
  }),
];
