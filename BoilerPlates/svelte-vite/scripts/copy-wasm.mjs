import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const pairs = [
  ["node_modules/scichart/_wasm/scichart2d.wasm", "public/scichart2d.wasm"],
  ["node_modules/scichart/_wasm/scichart2d-nosimd.wasm", "public/scichart2d-nosimd.wasm"],
];

for (const [fromRel, toRel] of pairs) {
  const from = resolve(rootDir, fromRel);
  const to = resolve(rootDir, toRel);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}
