const CopyPlugin = require("copy-webpack-plugin");
const development = require("./webpack.client.development.cjs");
const setupMiddleware = require("./scripts/devMiddleware.cjs");

module.exports = {
    ...development,
    cache: {
        ...development.cache,
        name: "client-no-server",
        buildDependencies: {
            config: [
                ...development.cache.buildDependencies.config,
                __filename,
                require.resolve("./scripts/devMiddleware.cjs"),
            ],
        },
    },
    plugins: [
        ...development.plugins,
        new CopyPlugin({ patterns: [{ from: "src/static/no_server.index.html", to: "index.html" }] }),
    ],
    devServer: {
        ...development.devServer,
        static: false,
        setupMiddlewares(middlewares, devServer) {
            setupMiddleware(devServer.app);
            return middlewares;
        },
    },
};
