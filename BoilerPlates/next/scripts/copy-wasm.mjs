import { readFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const configPath = resolve(rootDir, "copy-files-from-to.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

for (const file of config.copyFiles) {
  const from = resolve(rootDir, file.from);
  const to = resolve(rootDir, file.to);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}
