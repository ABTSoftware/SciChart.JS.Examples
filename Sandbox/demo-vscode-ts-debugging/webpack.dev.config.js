  
const { merge } = require("webpack-merge");
const webpackConfig = require("./webpack.config.js");

module.exports = merge(webpackConfig, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        allowedHosts: "all",
        client: {
            overlay: {
                warnings: false,
                errors: true
            }
        }
    }
});
