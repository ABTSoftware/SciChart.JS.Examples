import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const copySciChartWasm = () => ({
  name: "copy-scichart-wasm",
  buildStart() {
    const source = path.resolve("node_modules/scichart/_wasm");
    const target = path.resolve("public");
    fs.mkdirSync(target, { recursive: true });
    for (const file of fs.readdirSync(source).filter((file) => file.endsWith(".wasm"))) {
      const from = path.join(source, file);
      if (fs.existsSync(from)) fs.copyFileSync(from, path.join(target, file));
    }
  },
});

export default defineConfig({
  plugins: [react(), copySciChartWasm()],
  resolve: { alias: [{ find: /^scichart$/, replacement: path.resolve("node_modules/scichart/index.min.mjs") }] },
  assetsInclude: ["**/*.wasm"],
});
