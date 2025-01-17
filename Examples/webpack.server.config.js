const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const config = require("./config/default");
const nodeExternals = require("webpack-node-externals");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");

module.exports = {
    mode: "production",
    name: "server",
    target: "node",
    // devtool: "source-map", // If you enable this while developing, you MUST disable it again before commiting as it uses too much memory during produciton build
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: {
        express: "commonjs2 express",
        ws: "commonjs2 ws",
    },
    entry: "./src/server/server.tsx",
    output: {
        filename: "server.js",
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
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader",
                    },
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
                loader: "file-loader",
                options: {
                    name: "images/[name].[ext]",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new ImageminWebpWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "Examples/**/*",
                    context: path.resolve(__dirname, "src", "components"),
                    globOptions: {
                        dot: true,
                        gitignore: false,
                        ignore: [
                            "**/exampleInfo.*",
                            "**/*.jpg",
                            "**/*.png",
                            "**/ExamplesRoot.tsx",
                            "**/ExampleStrings.ts",
                        ],
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
