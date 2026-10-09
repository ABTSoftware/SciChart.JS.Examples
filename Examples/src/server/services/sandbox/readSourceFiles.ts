import * as fs from "fs";
import * as path from "path";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkTypes";
import type { ExampleSourceFile } from "../../../helpers/types/types";
import { IFiles, getSourceFilesForPath, loadStyles, csStyles } from "./sandboxDependencyUtils";
import { indexHtmlTemplate } from "./vanillaTsConfig";
import { useSingleExampleStylesheet } from "./sandboxStyles";

export const readSourceFiles = async (
    framework: EPageFramework,
    folderPath: string,
    baseUrl: string,
    stylesPath?: string
) => {
    await loadStyles(stylesPath);
    let files: IFiles = {};
    let actualFramework = framework;

    try {
        switch (framework) {
            case EPageFramework.Angular:
                files = await getSourceFilesForPath(folderPath, "angular.ts", baseUrl);
                break;
            case EPageFramework.React:
                files = await getSourceFilesForPath(folderPath, "index.tsx", baseUrl);
                break;
            case EPageFramework.Vanilla:
                files = await getSourceFilesForPath(folderPath, "vanilla.ts", baseUrl);
                const htmlPath = path.join(folderPath, "index.html");
                let html: string;
                try {
                    const charHtmlSetup = await fs.promises.readFile(htmlPath, "utf8");
                    html = indexHtmlTemplate(charHtmlSetup);
                } catch (err) {
                    html = indexHtmlTemplate();
                }
                files[htmlPath] = { content: html, isBinary: false };
                break;
            default:
                throw new Error("Invalid framework value!");
        }
    } catch (err) {
        // If files not found for requested framework, fallback to React
        if (framework !== EPageFramework.React) {
            actualFramework = EPageFramework.React;
            files = await getSourceFilesForPath(folderPath, "index.tsx", baseUrl);
        } else {
            throw err;
        }
    }

    const uiCss = csStyles["src/index.css"].content;
    const entryFileName =
        actualFramework === EPageFramework.Angular
            ? "angular.ts"
            : actualFramework === EPageFramework.Vanilla
            ? "vanilla.ts"
            : "index.tsx";
    const entryFilePath = path.join(folderPath, entryFileName);
    if (files[entryFilePath] === undefined) throw new Error(`Example source not found: ${entryFileName}`);
    const sourceFiles = useSingleExampleStylesheet({ ...csStyles, ...files }, uiCss, entryFilePath, "./index.css");
    const result: ExampleSourceFile[] = [];
    for (const key in sourceFiles) {
        const name = path.isAbsolute(key)
            ? path.relative(folderPath, key).replace(/\\/g, "/")
            : key.replace(/^src\//, "");
        result.push({ name, content: sourceFiles[key].content });
    }
    return { files: result, framework: actualFramework };
};
