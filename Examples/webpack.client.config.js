const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const config = require("./config/default");
const autoprefixer = require("autoprefixer");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

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
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                    },
                    { loader: "sass-loader" },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
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
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir),
    },
    // this is already done in the server build process, so probably there is no need doing it here
    // optimization: {
    //     minimizer: [
    //         // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
    //         `...`,
    //         new CssMinimizerPlugin(),
    //     ],
    // },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/favicon.ico", to: "" },
                { from: "src/static/webgl-intel.html", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Shale.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Density.csv", to: "" },
                {
                    from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Resistivity.csv",
                    to: "",
                },
                {
                    from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/PoreSpace.csv",
                    to: "",
                },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Sonic.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Texture.csv", to: "" },
                { from: "src/server/vanillaDemo/common.js", to: "" },
                { from: "node_modules/scichart/_wasm/scichart.browser.mjs", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
                { from: "sitemap.xml", to: "" },
                { from: process.env.NOINDEX ? "robotsNoIndex.txt" : "robots.txt", to: "robots.txt" },
            ],
        }),
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
            // these duplicate style.css extracted in server build
            filename: "stylesClientBundle.css",
        }),
        require("autoprefixer"),
    ],
};
