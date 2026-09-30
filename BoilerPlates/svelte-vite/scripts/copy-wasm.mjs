import { mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(
  fileURLToPath(new URL("../package.json", import.meta.url))
);
// Copy every wasm file shipped by scichart so the nosimd / 64-bit / 3D
// variants are served as well.
const fromDir = resolve(rootDir, "node_modules/scichart/_wasm");
const toDir = resolve(rootDir, "public");

mkdirSync(toDir, { recursive: true });
for (const file of readdirSync(fromDir).filter((f) => f.endsWith(".wasm"))) {
  copyFileSync(resolve(fromDir, file), resolve(toDir, file));
}
