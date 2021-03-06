const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const tq3080_DSM_2M = require("./src/server/Data/tq3080_DSM_2M");

// LICENSING //
// Set your license code here to license the SciChart.js Examples app
// You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
// Purchased license keys can be viewed at https://www.scichart.com/profile
//
// e.g.
//
// const betaTrialKey = "YOUR_RUNTIME_KEY";
//
// Also, once activated (trial or paid license) having the licensing wizard open on your machine
// will mean any or all applications you run locally will be fully licensed.

// Set your runtime key here
const betaTrialKey = "";

module.exports = {
    ...webpackClientConfig,
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
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
                                localIdentName: "[name]__[local]--[hash:base64:5]"
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
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/no_server.index.html", to: "index.html" },
                { from: "src/static/webgl-intel.html", to: "webgl-intel.html" },
                { from: "src/static/favicon.ico", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
                { from: "sitemap.xml", to: "" },
                { from: "robots.txt", to: "" }
            ]
        })
        // new CopyPlugin({
        //     patterns: [{ from: "src/static/no_server.index.html", to: "index.html" }]
        // })
    ],
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        proxy: {
            "/api/thevirustracker": {
                target: "https://thevirustracker.com",
                pathRewrite: { "^/api/thevirustracker": "" },
                secure: false,
                changeOrigin: true
            }
        },
        before: function(app, server, compiler) {
            app.get("/api/license", function(req, res) {
                res.send(betaTrialKey);
            });
            app.get("/api/lidarData", function(req, res) {
                res.send(tq3080_DSM_2M.tq3080_DSM_2M);
            });
        }
    }
};

// , {
//     mode: "development",
//     devtool: "inline-source-map",
//     watch: true,
//     plugins: [
//         new CopyPlugin({
//             patterns: [
//                 { from: "src/static/no_server.index.html", to: "index.html" }
//             ],
//         })
//     ],
//     devServer: {
//         disableHostCheck: true,
//         historyApiFallback: true,
//         proxy: {
//             "/api/thevirustracker": {
//                 target: "https://thevirustracker.com",
//                 pathRewrite: { "^/api/thevirustracker": "" },
//                 secure: false,
//                 changeOrigin: true
//             }
//         },
//         before: function(app, server, compiler) {
//             app.get("/api/license", function(req, res) {
//                 res.send(betaTrialKey);
//             });
//             app.get("/api/lidarData", function(req, res) {
//                 res.send(tq3080_DSM_2M.tq3080_DSM_2M);
//             });
//         }
//     }
// });
