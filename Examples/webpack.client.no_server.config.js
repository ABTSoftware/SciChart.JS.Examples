const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const tq3080_DSM_2M = require("./src/server/Data/tq3080_DSM_2M");
const { candlesADAUSDT } = require("./src/server/BinanceData/candlesADAUSDT");
const { candlesBTCUSDT } = require("./src/server/BinanceData/candlesBTCUSDT");
const { candlesDOGEUSDT } = require("./src/server/BinanceData/candlesDOGEUSDT");
const { candlesETHUSDT } = require("./src/server/BinanceData/candlesETHUSDT");
const { candlesXRPUSDT } = require("./src/server/BinanceData/candlesXRPUSDT");

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
    node: {
        child_process: "empty",
        fs: "empty",
        crypto: "empty",
        net: "empty",
        tls: "empty"
    },
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
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Shale.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Density.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Resistivity.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/PoreSpace.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Sonic.csv", to: "" },
                { from: "src/components/Examples/FeaturedApps/ShowCases/OilAndGasDashboard/Data/Texture.csv", to: "" },
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
        before: function(app, server, compiler) {
            app.get("/api/license", function(req, res) {
                res.send(betaTrialKey);
            });
            app.get("/api/lidarData", function(req, res) {
                res.send(tq3080_DSM_2M.tq3080_DSM_2M);
            });
            app.get("/api/get-binance-candles", function(req, res) {
                const params = req.query;
                let data;
                switch (params.symbol) {
                    case "ADAUSDT":
                        data = candlesADAUSDT;
                        break;
                    case "BTCUSDT":
                        data = candlesBTCUSDT;
                        break;
                    case "DOGEUSDT":
                        data = candlesDOGEUSDT;
                        break;
                    case "ETHUSDT":
                        data = candlesETHUSDT;
                        break;
                    case "XRPUSDT":
                        data = candlesXRPUSDT;
                        break;
                }
                res.send(data);
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
