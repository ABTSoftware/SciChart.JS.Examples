import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // WebAssembly modules copied to the output root, e.g. served at /scichart.wasm
        {
          src: "node_modules/scichart/_wasm/*",
          dest: "",
          rename: { stripBase: true },
        },
      ],
    }),
  ],
});
