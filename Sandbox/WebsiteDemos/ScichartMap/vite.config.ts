import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("/node_modules/")) return undefined;
          if (id.includes("/node_modules/scichart/")) return "scichart-vendor";
if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/")) return "react-vendor";
          return undefined;
        },
      },
    },
  },
});
