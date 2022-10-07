const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");

module.exports = merge(webpackClientConfig, {
    mode: "development",
    node: {
        child_process: "empty",
        fs: "empty",
        crypto: "empty",
        net: "empty",
        tls: "empty"
    },
    devtool: "inline-source-map",

    devServer: {
        disableHostCheck: true,
        proxy: {
            "/": {
                target: "http://localhost:3000"
            }
        }
    },
    watch: true,

});
