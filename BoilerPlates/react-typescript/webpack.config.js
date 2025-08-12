const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    performance: {
        hints: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/index.html', to: '' },
                { from: 'node_modules/scichart/_wasm/scichart2d.wasm', to: '' },
                { from: 'node_modules/scichart/_wasm/scichart3d.wasm', to: '' },
            ],
        }),
    ],
};
