const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const config = require("./config/default");
const autoprefixer = require("autoprefixer");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const filename = ext => `[name].[hash].${ext}`;

module.exports = {
    mode: "production",
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[hash:base64:5]"
                            }
                        }
                    },
                    {
                        loader: "postcss-loader"
                    },
                    { loader: "sass-loader" }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: {
                    name: "images/[name].[ext]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir)
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/favicon.ico", to: "" },
                { from: "src/static/webgl-intel.html", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
                { from: "sitemap.xml", to: "" },
                { from: "robots.txt", to: "" },
                { from: "src/components/Examples/BuilderApi/**/*.jpg", to: "images/[name].jpg" },
                { from: "src/components/Examples/Charts2D/Filters/**/*.jpg", to: "images/[name].jpg" },
                { from: "src/components/Examples/Charts2D/AxisLabelCustomization/**/*.jpg", to: "images/[name].jpg" },
                { from: "src/components/Examples/Charts2D/Animations/**/*.png", to: "images/[name].png" }
            ]
        }),
        // new BundleAnalyzerPlugin()
        new MiniCssExtractPlugin({
            filename: filename("styles.css")
        }),
        require("autoprefixer")
    ]
};
