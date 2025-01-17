const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

const tq3080_DSM_2M = require("./src/server/Data/tq3080_DSM_2M");
const { candlesADAUSDT } = require("./src/server/BinanceData/candlesADAUSDT");
const { candlesBTCUSDT } = require("./src/server/BinanceData/candlesBTCUSDT");
const { candlesDOGEUSDT } = require("./src/server/BinanceData/candlesDOGEUSDT");
const { candlesETHUSDT } = require("./src/server/BinanceData/candlesETHUSDT");
const { candlesXRPUSDT } = require("./src/server/BinanceData/candlesXRPUSDT");
const TweetData = require("./src/server/Data/tweetData");

module.exports = {
    ...webpackClientConfig,
    mode: "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css"],
        fallback: {
            child_process: false,
            fs: false,
            crypto: false,
            net: false,
            tls: false,
        },
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[name]__[local]--[hash:base64:5]",
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
                loader: "file-loader",
                options: {
                    name: "images/[name].[ext]",
                },
            },
        ],
    },
    plugins: [
        new ImageminWebpWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: "src/static/no_server.index.html", to: "index.html" },
                { from: "src/static/webgl-intel.html", to: "webgl-intel.html" },
                { from: "src/static/favicon.ico", to: "" },
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
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
                { from: "sitemap.xml", to: "" },
                { from: "robots.txt", to: "" },
                { from: "src/assets", to: "assets" },
            ],
        }),
    ],
    devServer: {
        client: {
            progress: true,
        },
        static: {
            directory: "src/assets",
            publicPath: "/assets",
        },
        allowedHosts: "all",
        historyApiFallback: true,
        onBeforeSetupMiddleware: function (devServer) {
            const { app } = devServer;
            app.get("/api/lidarData", function (req, res) {
                res.send(tq3080_DSM_2M.tq3080_DSM_2M);
            });
            app.get("/api/tweetData", function (req, res) {
                res.send(TweetData.TweetData);
            });
            app.get("/api/get-binance-candles", function (req, res) {
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
        },
    },
};
