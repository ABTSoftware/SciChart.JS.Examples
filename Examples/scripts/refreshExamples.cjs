// SciChart init functions are captured in hooks: remount edited charts to run cleanup
// and recreate their WASM resources, while retaining the gallery/router state.
module.exports = (source) => "// @refresh reset\n" + source;
