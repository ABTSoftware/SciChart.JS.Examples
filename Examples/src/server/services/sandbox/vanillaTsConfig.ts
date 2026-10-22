import * as fs from "fs";
import * as path from "path";
import { TExampleInfo } from "../../../components/AppRouter/examplePages";
import { IFiles, getSourceFilesForPath } from "./sandboxDependencyUtils";
import { viteProjectFiles, chartBootstrap } from "./viteConfig";
import { NotFoundError } from "../../Errors";

export const getVanillaSrc = async (folderPath: string) => {
    try {
        return await fs.promises.readFile(path.join(folderPath, "vanilla.ts"), "utf8");
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT")
            throw new NotFoundError("Vanilla version not found! Try a different framework.");
        throw error;
    }
};

export const indexHtmlTemplate = (customChartSetup?: string) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SciChart Example</title>
    </head>
    <body style="margin: 0; height: 100vh;">
        ${customChartSetup ?? '<div id="chart" style="height: 100%;"></div>'}
        <script type="module" src="/src/main.ts"></script>
    </body>
</html>`;

export const getVanillaTsSandBoxConfig = async (folderPath: string, currentExample: TExampleInfo, baseUrl: string) => {
    const files: IFiles = await getSourceFilesForPath(folderPath, "vanilla.ts", baseUrl, "app.ts");
    files["src/main.ts"] = { content: `${chartBootstrap}\nimport "./app";\n`, isBinary: false };
    let customHtml: string | undefined;
    try {
        customHtml = await fs.promises.readFile(path.join(folderPath, "index.html"), "utf8");
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    files["index.html"] = { content: indexHtmlTemplate(customHtml), isBinary: false };
    return { files: viteProjectFiles(currentExample.path, files, false, currentExample.extraDependencies) };
};
