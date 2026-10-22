const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const config = require("./config/default");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    //devtool: "source-map",
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader", "postcss-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: { loader: "ts-loader", options: { configFile: "tsconfig.browser.json" } },
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: "asset/resource",
                generator: {
                    // Generator options for asset modules
                    // Emit an output asset from this asset module. This can be set to 'false' to omit emitting e. g. for SSR.
                    // type: boolean
                    emit: true,

                    filename: "[name][ext]",

                    // // Customize publicPath for asset modules, available since webpack 5.28.0
                    // // type: string | ((pathData: PathData, assetInfo?: AssetInfo) => string)
                    publicPath: "images/",

                    // Emit the asset in the specified folder relative to 'output.path', available since webpack 5.67.0
                    // type: string | ((pathData: PathData, assetInfo?: AssetInfo) => string)
                    outputPath: "images/",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css"],
        alias: {
            // "scichart-react": path.resolve(__dirname, "./src/scichart-react"),
            "scichart-addons": path.resolve(__dirname, "../Addons"),
        },
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir),
    },
    // performance: {
    //     maxAssetSize: 2000000, // Sets the maximum individual asset size to 2MB (in bytes)
    //     maxEntrypointSize: 2000000, // Sets the maximum entry point size to 2MB (in bytes)
    // },
    plugins: [
        new webpack.DefinePlugin({ __SCICHART_LAZY_EXAMPLES__: false }),
        new CopyPlugin({
            patterns: require("./webpack.assets.cjs"),
        }),
        new MiniCssExtractPlugin({
            // these duplicate style.css extracted in server build
            filename: "stylesClientBundle.css",
        }),
        require("autoprefixer"),
    ],
};
