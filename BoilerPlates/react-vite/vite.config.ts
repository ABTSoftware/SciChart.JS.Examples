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
          src: "node_modules/scichart/_wasm/scichart2d.data",
          dest: "/",
        },
        {
          src: "node_modules/scichart/_wasm/scichart2d.wasm",
          dest: "/",
        },
        // same for 3d if needed
      ],
    }),
  ],
});
