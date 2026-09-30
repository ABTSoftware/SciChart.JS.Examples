import { spawn } from "child_process";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import fs from "fs";
import copy from "rollup-plugin-copy";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js",
    // scichart loads its wasm glue via dynamic import, which rollup would
    // otherwise split into extra chunks - not supported by the iife format
    inlineDynamicImports: true,
  },
  plugins: [
    copy({
      targets: [{ src: "src/index.html", dest: "public" }],
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    // inject WASM files from SciChart into the bundle. The folder holds the
    // simd, nosimd, 64-bit and 3D variants - emit them all so whichever the
    // browser asks for is served.
    {
      name: "wasm",
      generateBundle() {
        const wasmDir = "node_modules/scichart/_wasm";
        for (const file of fs.readdirSync(wasmDir)) {
          if (!file.endsWith(".wasm")) continue;
          this.emitFile({
            type: "asset",
            fileName: file,
            source: fs.readFileSync(`${wasmDir}/${file}`),
          });
        }
      },
    },

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
