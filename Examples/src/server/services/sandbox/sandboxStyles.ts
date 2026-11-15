import type { IFiles } from "./sandboxDependencyUtils";
import * as fs from "fs";
import * as path from "path";
import { EPageFramework } from "../../../helpers/shared/Helpers/frameworkTypes";
import { moduleReferences } from "./sandboxDependencyUtils";
import * as ts from "typescript";
import { createExampleStylesheet } from "./exampleCss";

export const generatedStylesPath = (folderPath: string, framework: EPageFramework) =>
    path.join(
        folderPath.replace(
            `${path.sep}src${path.sep}components${path.sep}Examples${path.sep}`,
            `${path.sep}build${path.sep}Examples${path.sep}`
        ),
        ".sandbox-styles",
        framework,
        "styles.css"
    );

export const readLocalStyles = async (folderPath: string) => {
    const names = (await fs.promises.readdir(folderPath)).filter((name) => name.endsWith(".css")).sort();
    return Promise.all(
        names.map(async (name) => ({ name, content: await fs.promises.readFile(path.join(folderPath, name), "utf8") }))
    );
};

/**
 * Production reads build artifacts. A source checkout always compiles from the current sources: artifacts
 * left in build/ by an earlier `npm run build` are stale as soon as an example or sc-ui.css is edited.
 */
export const loadExampleStylesheet = async (
    folderPath: string,
    framework: EPageFramework,
    uiCss: string,
    files: IFiles
) => {
    const isSourceCheckout = folderPath.includes(`${path.sep}src${path.sep}components${path.sep}Examples${path.sep}`);
    if (!isSourceCheckout) {
        try {
            return await fs.promises.readFile(generatedStylesPath(folderPath, framework), "utf8");
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
            if (process.env.NODE_ENV === "production") {
                throw new Error(`Example styles are missing for ${folderPath} (${framework}). Run npm run build.`);
            }
        }
    }
    const localStyles = await readLocalStyles(folderPath);
    const importedCss = Object.entries(files)
        .filter(([name]) => name.endsWith(".css"))
        .map(([, file]) => file.content);
    const source = Object.entries(files)
        .filter(([name, file]) => !file.isBinary && /\.(?:tsx?|jsx?|html)$/.test(name))
        .map(([, file]) => file.content)
        .join("\n");
    return createExampleStylesheet(
        source,
        uiCss,
        [...new Set([...localStyles.map((file) => file.content), ...importedCss])].join("\n")
    );
};

/** Replace all example CSS imports with one readable stylesheet in the exported project. */
export const useSingleExampleStylesheet = (files: IFiles, css: string, entryFilePath: string): IFiles => {
    const output = Object.fromEntries(Object.entries(files).map(([name, file]) => [name, { ...file }]));
    const entryFile = output[entryFilePath];
    if (!entryFile) throw new Error(`Sandbox example source not found: ${entryFilePath}`);

    for (const [name, file] of Object.entries(output)) {
        if (name.endsWith(".css")) delete output[name];
        else if (/\.[jt]sx?$/.test(name)) {
            const cssImports = moduleReferences(file.content, name).filter(
                (reference) =>
                    reference.text.startsWith(".") &&
                    reference.text.endsWith(".css") &&
                    ts.isImportDeclaration(reference.parent)
            );
            for (const reference of cssImports.reverse()) {
                file.content =
                    file.content.slice(0, reference.parent.getStart()) + file.content.slice(reference.parent.getEnd());
            }
        }
    }
    // Angular already loads this stylesheet once through angular.json.
    if (!output["angular.json"]) entryFile.content = `import "./styles.css";\n${entryFile.content.trimStart()}`;
    output["src/styles.css"] = { content: css, isBinary: false };
    return output;
};
