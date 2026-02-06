import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        // Copy SciChart WASM files to output directory for serving
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/scichart/_wasm/scichart2d.wasm",
                    dest: ""
                },
            ]
        }),
        devtools(),
        viteReact({
            babel: {
                plugins: ["babel-plugin-react-compiler"]
            }
        }),
        tailwindcss()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
});
