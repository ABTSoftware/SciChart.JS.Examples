const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");

module.exports = merge(webpackClientConfig, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        disableHostCheck: true,
        proxy: {
            "/": {
                target: "http://localhost:3000"
            }
        }
    },
    watch: true
});
