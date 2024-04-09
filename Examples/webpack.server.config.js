const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const config = require("./config/default");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    name: "server",
    target: "node",
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
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "Examples/**/*",
                    context: path.resolve(__dirname, "src", "components"),
                    globOptions: {
                        dot: true,
                        gitignore: false,
                        ignore: ["**/exampleInfo.*", "**/*.jpg", "**/ExamplesRoot.tsx", "**/ExampleStrings.ts"],
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
