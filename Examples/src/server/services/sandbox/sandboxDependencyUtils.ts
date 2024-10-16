import * as path from "path";
import * as fs from "fs";

export interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}

export let csStyles: IFiles;
export const loadStyles = async (folderPath: string) => {
    if (!csStyles) {
        const basePath = path.join(folderPath, "styles", "_base.scss");
        const base = await fs.promises.readFile(basePath, "utf8");
        const mixinsPath = path.join(folderPath, "styles", "mixins.scss");
        const mixins = await fs.promises.readFile(mixinsPath, "utf8");
        const examplesPath = path.join(folderPath, "styles", "Examples.module.scss");
        const examples = await fs.promises.readFile(examplesPath, "utf8");
        csStyles = {
            "src/styles/_base.scss": { content: base, isBinary: false },
            "src/styles/mixins.scss": { content: mixins, isBinary: false },
            "src/styles/Examples.module.scss": { content: examples, isBinary: false },
        };
    }
};

export type SandboxConfig = { files: IFiles };

export const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error(`Invalid framework value=${value}!`);
};

export const includeExternalModules = async (
    folderPath: string,
    files: IFiles,
    content: string,
    includeImages: boolean,
    updateImports: boolean
) => {
    // Pull files outside the local folder into it and rewrite the import
    const externalImports = Array.from(content.matchAll(/from "\.\.\/(.*)";/g));
    if (externalImports.length > 0) {
        for (const externalImport of externalImports) {
            if (externalImport.length > 1) {
                if (externalImport[1].endsWith(".png") || externalImport[1].endsWith(".jpg")) {
                    if (includeImages) {
                        // handle images
                        const csPath = "src/" + externalImport[1];
                        const filename = externalImport[1].substring(externalImport[1].lastIndexOf("/") + 1);
                        files[csPath] = { content: "https://demo.scichart.com/images/" + filename, isBinary: true };
                    }
                } else {
                    const filepath = path.join(folderPath, "../" + externalImport[1] + ".ts");
                    const filename = externalImport[1].substring(externalImport[1].lastIndexOf("/") + 1);
                    const csPath = "src/" + filename + ".ts";
                    if (updateImports) {
                        content = content.replace("../" + externalImport[1], "./" + filename);
                    }
                    if (!files[csPath]) {
                        const externalContent = await fs.promises.readFile(filepath, "utf8");
                        files[csPath] = { content: externalContent, isBinary: false };
                    }
                }
            }
        }
    }
    return content;
};

export const includeImportedModules = async (
    folderPath: string,
    files: IFiles,
    code: string,
    includeImages: boolean,
    updateImports: boolean,
    baseUrl: string
) => {
    const localImports = Array.from(code.matchAll(/from ["']\.\/(.*)["'];/g));
    for (const localImport of localImports) {
        if (localImport.length > 1) {
            let content: string = "";
            let csPath: string = "";
            if (localImport[1].endsWith(".png") || localImport[1].endsWith(".jpg")) {
                if (includeImages) {
                    // handle images
                    csPath = "src/" + localImport[1];
                    const filename = localImport[1].substring(localImport[1].lastIndexOf("/") + 1);
                    console.log(baseUrl + filename);
                    files[csPath] = { content: baseUrl + filename, isBinary: true };
                }
            } else {
                try {
                    const filepath = path.join(folderPath, localImport[1] + ".ts");
                    csPath = "src/" + localImport[1] + ".ts";
                    content = await fs.promises.readFile(filepath, "utf8");
                } catch (e) {
                    const filepath = path.join(folderPath, localImport[1] + ".tsx");
                    csPath = "src/" + localImport[1] + ".tsx";
                    content = await fs.promises.readFile(filepath, "utf8");
                }
                const nestedImports = Array.from(content.matchAll(/from "\.\/(.*)";/g));
                if (nestedImports.length > 0) {
                    localImports.push(...nestedImports);
                }
                content = await includeExternalModules(folderPath, files, content, includeImages, updateImports);
                files[csPath] = { content, isBinary: false };
            }
        }
    }
};

export const getSourceFilesForPath = async (folderPath: string, startFile: string, baseUrl: string) => {
    const tsPath = path.join(folderPath, startFile);
    let code = await fs.promises.readFile(tsPath, "utf8");
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, false, false, baseUrl);
    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    await includeExternalModules(folderPath, files, code, false, false);
    files[tsPath] = { content: code, isBinary: false };
    return files;
};

export const commonFiles: IFiles = {
    "tsconfig.json": {
        content: `{
"include": [
  "./src/**/*"
],
"compilerOptions": {
  "strict": false,
  "strictPropertyInitialization": false,
  "esModuleInterop": true,
  "target": "es5",
  "downlevelIteration": true,
  "lib": [
      "dom",
      "es2015"
  ],
  "typeRoots": ["./src/types", "./node_modules/@types"],
  "jsx": "react-jsx"
}
}`,
        isBinary: false,
    },
    "sandbox.config.json": {
        content: `{
"infiniteLoopProtection": false,
"hardReloadOnChange": false,
"view": "browser"
}`,
        isBinary: false,
    },
    "src/types/declaration.d.ts": {
        content: `declare module "*.scss" {
        const content: Record<string, string>;
        export default content;
    }`,
        isBinary: false,
    },
    "src/types/jpg.d.ts": {
        content: `declare module "*.jpg" {
        const value: any;
        export default value;
    }`,
        isBinary: false,
    },
    "src/types/png.d.ts": {
        content: `declare module "*.png" {
        const value: any;
        export default value;
    } `,
        isBinary: false,
    },
    "src/types/svg.d.ts": {
        content: `declare module "*.svg" {
        const value: any;
        export default value;
    }`,
        isBinary: false,
    },
};
