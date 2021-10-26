const { merge } = require("webpack-merge");
const webpackConfig = require("./webpack.config.js");

module.exports = merge(webpackConfig, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        disableHostCheck: true,
        before: function(app, server, compiler) {
            app.get("/api/getdata", function(req, res) {
                res.send("This came from the server");
            });
        }
    }
});
