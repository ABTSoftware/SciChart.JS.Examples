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
            // {
            //     test: /\.css$/,
            //     use: ["style-loader", "css-loader"],
            //     exclude: /node_modules/
            // },
            // {
            //     test: /\.scss$/,
            //     use: [
            //         { loader: "style-loader" }, // to inject the result into the DOM as a style block
            //         // { loader: "css-modules-typescript-loader"},  // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
            //         {
            //             loader: "css-loader",
            //             // options: {
            //             //     modules: {
            //             //         localIdentName: "[name]__[local]--[hash:base64:5]"
            //             //     }
            //             // }
            //         }, // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
            //         { loader: "sass-loader" } // to convert SASS to CSS
            //         // NOTE: The first build after adding/removing/renaming CSS classes fails, since the newly generated .d.ts typescript module is picked up only later
            //     ],
            //     exclude: /node_modules/
            // },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: {
                    name: "images/[name].[ext]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
