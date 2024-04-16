const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  basePath: "",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    const destWasmFolder = "static/chunks/pages";
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/scichart/_wasm/scichart2d.wasm",
            to: destWasmFolder,
          },
        ],
      })
    );

    // Important: return the modified config
    return config;
  },
};
