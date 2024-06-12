module.exports = {
  basePath: "",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return config;
  },
};
