import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // copy the whole folder so the nosimd / 64-bit / 3D wasm
          // variants are served too
          src: "node_modules/scichart/_wasm/*",
          dest: "",
          // flatten, so the files land next to index.html
          rename: { stripBase: true },
        },
      ],
    }),
  ],
});
