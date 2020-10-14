const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const betaTrialKey = "WcnXtRLwGVtfNA59XwvDQA11wSpykEA1NEpARELTB+Aq6kf2nJSK9GgWOKvCJA6P+jNg2xcVLw3oM7EdIIi0MJtvorAARa9au01LV/xLJ1jdOeDeMXpw/eT5ajSpukKcJXHe97tzsBzfB6wRziW6LgNjuB3ykFIk+tGvOmJyhRewYjF+FCSb/0q8Bq8em4lNmOfONzJz5spVWvvfHdn5iIYfvv00hhduow4bFzxXnRucLtHl2Bm1yFvrVYe0UOQcFpJ9DZ4S96GLhSw9SIkUSAy/C5r3FvdCkX8d40ehAg+n78w92QXwh4B41xF0f+9OHpeV3byaZDNr5L1afdS3qCahoyeYEnmt4hYdmGH3uS+KtC29bAcVXUqNA9P3pESndALjlEimVNfr6RrfKEY3jroWtPXEx2Oo9XcD3ZLUJiRrjDL0lTf/3a6+KN1xsl2K2eymqyo9Wggy7Mf3WymmvURil7SaxE3xBP5LWWGPMEXvf9m7vXGz6fkEtsZhdEC3HQprBwEGyV1zPdLxDqtWO9ltEBEBlS2FrzJ3984/zSp9sbc=";
module.exports = merge(webpackClientConfig, {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/no_server.index.html", to: "index.html" }
            ],
        })
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
        }
    }    
});
