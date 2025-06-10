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
const TweetData = require("./src/server/Data/tweetData");
const { multiPaneData } = require("./src/server/Data/multiPaneData");
const { mappedPopulationData } = require("./src/server/Data/populationData");

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
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/no_server.index.html", to: "index.html" },
                { from: "src/static/webgl-intel.html", to: "webgl-intel.html" },
                { from: "src/static/favicon.ico", to: "" },
                { from: "src/components/Examples/**/*.jpg", to: "images/[name][ext]" },
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
                {
                    from: "src/components/Examples/Charts2D/PolarCharts/PolarUniformHeatmapUltrasound/heatmap_data.csv",
                    to: "",
                },
                // { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                // { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
                { from: "sitemap.xml", to: "" },
                { from: "robots.txt", to: "" },
                { from: "src/assets", to: "assets" },
                { from: "src/server/Data/geojson/australia.json", to: "" },
                { from: "src/server/Data/geojson/africa.json", to: "" },
                { from: "src/server/Data/geojson/world.json", to: "" },
                { from: "src/server/Data/geojson/usaStates.json", to: "" },
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
        onBeforeSetupMiddleware: function (devServer: any) {
            const { app } = devServer;
            app.get("/api/lidarData", function (req: any, res: any) {
                res.send(tq3080_DSM_2M.tq3080_DSM_2M);
            });
            app.get("/api/tweetData", function (req: any, res: any) {
                res.send(TweetData.TweetData);
            });
            app.get("/api/multiPaneData", function (req: any, res: any) {
                res.send(multiPaneData);
            });
            app.get("/api/populationData", function (req: any, res: any) {
                res.send(mappedPopulationData);
            });
            app.get("/api/get-binance-candles", function (req: any, res: any) {
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
