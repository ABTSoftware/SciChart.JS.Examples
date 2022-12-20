const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");

module.exports = merge(webpackClientConfig, {
    mode: "development",
    resolve: {
        fallback : {
            child_process: false,
            fs: false,
            crypto: false,
            net: false,
            tls: false
        }
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
