const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const config = require("./config/default");
const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode: "production",
    name: "server",
    target: "node",
    // devtool: "source-map", // If you enable this while developing, you MUST disable it again before commiting as it uses too much memory during produciton build
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: {
        express: "commonjs2 express",
        ws: "commonjs2 ws",
        // Source/export APIs use the installed compiler; don't bundle/minify it into both server entries.
        typescript: "commonjs2 typescript",
    },
    entry: {
        server: "./src/server/server.tsx",
        generateSitemapScript: "./generate-sitemap.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, config.buildConfig.targetDir),
    },
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: { loader: "ts-loader", options: { configFile: "tsconfig.server.json" } },
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: "asset/resource",
                generator: {
                    // Generator options for asset modules
                    // Emit an output asset from this asset module. This can be set to 'false' to omit emitting e. g. for SSR.
                    // type: boolean
                    emit: false,

                    filename: "[name][ext]",

                    // // Customize publicPath for asset modules, available since webpack 5.28.0
                    // // type: string | ((pathData: PathData, assetInfo?: AssetInfo) => string)
                    publicPath: "images/",

                    // // Emit the asset in the specified folder relative to 'output.path', available since webpack 5.67.0
                    // // type: string | ((pathData: PathData, assetInfo?: AssetInfo) => string)
                    outputPath: "images/",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            // "scichart-react": path.resolve(__dirname, "./src/scichart-react"),
            "scichart-addons": path.resolve(__dirname, "../Addons"),
        },
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    // performance: {
    //     maxAssetSize: 2000000, // Sets the maximum individual asset size to 2MB (in bytes)
    //     maxEntrypointSize: 2000000, // Sets the maximum entry point size to 2MB (in bytes)
    // },
    plugins: [
        new webpack.DefinePlugin({ __SCICHART_LAZY_EXAMPLES__: false }),
        new CopyPlugin({
            patterns: [
                {
                    from: "Examples/**/*",
                    context: path.resolve(__dirname, "src", "components"),
                    globOptions: {
                        dot: true,
                        gitignore: false,
                        ignore: ["**/exampleInfo.*", "**/*.jpg", "**/*.png", "**/ExampleStrings.ts"],
                    },
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "style.css",
        }),
        require("autoprefixer"),
    ],
};
