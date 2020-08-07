const path = require("path");
const config = require("./config/default");

module.exports = {
    mode: "production",
    name: "server",
    target: "node",
    externals: {
        express: "commonjs2 express"
    },
    entry: "./src/server/server.tsx",
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir)
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
