import * as fs from "fs";
import * as path from "path";
import { EPageFramework } from "../src/helpers/shared/Helpers/frameworkTypes";
import { getSourceFilesForPath } from "../src/server/services/sandbox/sandboxDependencyUtils";
import { generatedStylesPath, readLocalStyles } from "../src/server/services/sandbox/sandboxStyles";

import { createExampleStylesheet } from "../src/server/services/sandbox/exampleCss";

const entryFiles = {
    [EPageFramework.React]: "index.tsx",
    [EPageFramework.Vanilla]: "vanilla.ts",
    [EPageFramework.Angular]: "angular.ts",
};

/** Run after buildServer copies sources, so local styles.css is never overwritten in the checkout. */
export const generateExampleStyles = async (examplesRoot = path.resolve("src/components/Examples")) => {
    const uiCss = await fs.promises.readFile(path.join(examplesRoot, "styles/sc-ui.css"), "utf8");
    let examples = 0;
    let stylesheets = 0;
    const visit = async (folder: string): Promise<void> => {
        const entries = await fs.promises.readdir(folder, { withFileTypes: true });
        if (!entries.some((entry) => /^exampleInfo\.tsx?$/.test(entry.name))) {
            for (const entry of entries) if (entry.isDirectory()) await visit(path.join(folder, entry.name));
            return;
        }
        if (!entries.some((entry) => entry.name === "index.tsx"))
            throw new Error(`Missing React example entry: ${folder}`);
        examples++;
        const localCss = await readLocalStyles(folder);
        for (const framework of Object.values(EPageFramework)) {
            const entryFile = entryFiles[framework];
            if (!entries.some((entry) => entry.name === entryFile)) continue;
            const files = await getSourceFilesForPath(folder, entryFile, "");
            const source = Object.entries(files)
                .filter(([name, file]) => !file.isBinary && /\.(?:tsx?|jsx?|html)$/.test(name))
                .map(([, file]) => file.content)
                .join("\n");
            const html =
                framework === EPageFramework.Vanilla && entries.some((entry) => entry.name === "index.html")
                    ? await fs.promises.readFile(path.join(folder, "index.html"), "utf8")
                    : "";
            const importedCss = Object.entries(files)
                .filter(([name]) => name.endsWith(".css"))
                .map(([, file]) => file.content);
            const css = createExampleStylesheet(
                source + "\n" + html,
                uiCss,
                [...new Set([...importedCss, ...localCss.map((file) => file.content)])].join("\n")
            );
            const target = generatedStylesPath(folder, framework);
            await fs.promises.mkdir(path.dirname(target), { recursive: true });
            await fs.promises.writeFile(target, css);
            stylesheets++;
        }
    };
    await visit(examplesRoot);
    return { examples, stylesheets };
};

if (require.main === module) {
    generateExampleStyles()
        .then(({ examples, stylesheets }) => {
            console.log(`Generated ${stylesheets} readable stylesheets for ${examples} examples.`);
        })
        .catch((error) => {
            console.error(error);
            process.exitCode = 1;
        });
}
