const development = require("./webpack.client.development.cjs");
const setupMiddleware = require("./scripts/devMiddleware.cjs");
module.exports = {
    ...development,
    cache: { ...development.cache, name: "client-with-server" },
    devServer: {
        ...development.devServer,
        static: false,
        setupMiddlewares(middlewares, devServer) {
            setupMiddleware(devServer.app, { withApi: false });
            return middlewares;
        },
        proxy: { "/": { target: "http://localhost:3000" } },
    },
};
