const path = require("path");

// Register a require hook for image files that works with both CommonJS and ES modules
require.extensions[".jpg"] = function (module, filename) {
    // Get the relative path from the Examples directory
    const examplesDir = path.resolve(__dirname, "..");
    const relativePath = path.relative(examplesDir, filename);

    // Create a module object with both CommonJS and ES module exports
    const moduleObj = {
        __esModule: true,
        default: relativePath,
        toString: function () {
            return relativePath;
        },
    };

    module.exports = moduleObj;
};

require.extensions[".png"] = function (module, filename) {
    // Get the relative path from the Examples directory
    const examplesDir = path.resolve(__dirname, "..");
    const relativePath = path.relative(examplesDir, filename);

    // Create a module object with both CommonJS and ES module exports
    const moduleObj = {
        __esModule: true,
        default: relativePath,
        toString: function () {
            return relativePath;
        },
    };

    module.exports = moduleObj;
};
