import * as fs from "fs";
import * as path from "path";
import { createExampleStylesheet } from "../src/server/services/sandbox/sandboxStyles";

const entryFiles: Record<string, string> = {
    react: "index.tsx",
    javascript: "vanilla.ts",
    angular: "angular.ts",
};

const main = async () => {
    const [exampleFolder, framework = "react", outputFile] = process.argv.slice(2);
    const entryFile = entryFiles[framework];
    if (!exampleFolder || !entryFile) {
        throw new Error("Usage: npm run exportExampleCss -- <example-folder> [react|javascript|angular] [index.css]");
    }

    const folderPath = path.resolve(process.cwd(), exampleFolder);
    const code = await fs.promises.readFile(path.join(folderPath, entryFile), "utf8");

    const stylesPath = path.resolve(__dirname, "../src/components/Examples/styles");
    const uiCss = await fs.promises.readFile(path.join(stylesPath, "sc-ui.css"), "utf8");
    const css = createExampleStylesheet(code, uiCss);
    const targetPath = outputFile ? path.resolve(process.cwd(), outputFile) : path.join(folderPath, "index.css");
    await fs.promises.writeFile(targetPath, css);
    process.stdout.write(`Wrote ${path.relative(process.cwd(), targetPath)} (${css.length} bytes)\n`);
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
