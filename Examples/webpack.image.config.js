const path = require("path");
const config = require("./config/default");

module.exports = {
    mode: "production",
    entry: "./imageDynamicImport.ts",
    module: {
        rules: [
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
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "imageImportChunk.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir),
        clean: true,
    },
};
