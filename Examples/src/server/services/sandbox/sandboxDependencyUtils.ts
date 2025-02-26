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
    examplefolderPath: string,
    folderPath: string,
    files: IFiles,
    content: string,
    includeImages: boolean,
    updateImports: boolean
) => {
    // Pull files outside the local folder into it and rewrite the import
    const externalImports = Array.from(content.matchAll(/from "([\.\/]+)(.*)";/g));
    if (externalImports.length > 0) {
        for (const externalImport of externalImports) {
            if (externalImport.length > 1) {
                if (externalImport[2].endsWith(".scss")) continue;
                if (externalImport[2].endsWith(".png") || externalImport[2].endsWith(".jpg")) {
                    if (includeImages) {
                        // handle images
                        const csPath = "src/" + externalImport[2];
                        const filename = externalImport[2].substring(externalImport[2].lastIndexOf("/") + 1);
                        files[csPath] = { content: "https://demo.scichart.com/images/" + filename, isBinary: true };
                    }
                } else {
                    const filepath = path.join(folderPath, externalImport[1] + externalImport[2] + ".ts");
                    const filename = externalImport[2].substring(externalImport[2].lastIndexOf("/") + 1);
                    let csPath = filepath.replace(examplefolderPath, "src").replace(/\\/g, "/");
                    //console.log(externalImport[1] + externalImport[2], csPath);
                    if (updateImports) {
                        if (!filepath.includes(examplefolderPath)) {
                            csPath = "src/" + filename + ".ts";
                            content = content.replace(externalImport[1] + externalImport[2], "./" + filename);
                            //console.log("Updating import", filepath, csPath, externalImport[1] + externalImport[2]);
                        }
                    }
                    const csPathx = csPath + "x";
                    if (!files[csPath] && !files[csPathx]) {
                        try {
                            const externalContent = await fs.promises.readFile(filepath, "utf8");
                            //console.log(filepath);
                            files[csPath] = { content: externalContent, isBinary: false };
                        } catch {
                            const filepathx = filepath + "x";
                            try {
                                const externalContentx = await fs.promises.readFile(filepathx, "utf8");
                                files[csPathx] = { content: externalContentx, isBinary: false };
                            } catch {
                                console.log(externalImport[2], "not found at", filepath, "from", folderPath);
                                files[csPath] = { content: "Could not load source", isBinary: false };
                            }
                        }
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
    //console.log(folderPath);
    const localImports = Array.from(code.matchAll(/from ["']\.\/(.*)["'];/g));
    for (const localImport of localImports) {
        if (localImport.length > 1) {
            let content: string = "";
            let csPath: string = "";
            let dirname: string = "";
            //console.log(localImport[1]);
            if (localImport[1].endsWith(".png") || localImport[1].endsWith(".jpg")) {
                if (includeImages) {
                    // handle images
                    csPath = "src/" + localImport[1];
                    const filename = localImport[1].substring(localImport[1].lastIndexOf("/") + 1);
                    files[csPath] = { content: baseUrl + filename, isBinary: true };
                }
            } else {
                csPath = "src/" + localImport[1] + ".ts";
                const csxPath = "src/" + localImport[1] + ".tsx";
                if (!files[csPath] && !files[csxPath]) {
                    try {
                        const filepath = path.join(folderPath, localImport[1] + ".ts");
                        //console.log(csPath);
                        content = await fs.promises.readFile(filepath, "utf8");
                        dirname = path.dirname(filepath);
                    } catch (e) {
                        try {
                            const filepath = path.join(folderPath, localImport[1] + ".tsx");
                            //console.log("not found. trying ", filepath);
                            csPath = "src/" + localImport[1] + ".tsx";
                            content = await fs.promises.readFile(filepath, "utf8");
                            dirname = path.dirname(filepath);
                        } catch {
                            console.log(localImport[1], "not loaded for", folderPath);
                            content = "could not load source";
                        }
                    }
                    if (!localImport[1].includes("/")) {
                        // this only works if the import is in the base folder
                        const nestedImports = Array.from(content.matchAll(/from "\.\/(.*)";/g));
                        if (nestedImports.length > 0) {
                            localImports.push(...nestedImports);
                        }
                    }
                    //console.log("processing externals for", localImport[1]);
                    content = await includeExternalModules(
                        folderPath,
                        dirname,
                        files,
                        content,
                        includeImages,
                        updateImports
                    );
                    files[csPath] = { content, isBinary: false };
                }
            }
        }
    }
    // stylesheets
    const cssImports = Array.from(code.matchAll(/import ["']\.\/(.*\.css)["'];/g));
    for (const cssImport of cssImports) {
        if (cssImport.length > 1) {
            const csPath = "src/" + cssImport[1];
            const filepath = path.join(folderPath, cssImport[1]);
            const content = await fs.promises.readFile(filepath, "utf8");
            files[csPath] = { content, isBinary: false };
        }
    }
};

export const getSourceFilesForPath = async (folderPath: string, startFile: string, baseUrl: string) => {
    const tsPath = path.join(folderPath, startFile);
    let code = await fs.promises.readFile(tsPath, "utf8");
    let files: IFiles = {};
    await includeImportedModules(folderPath, files, code, false, false, baseUrl);
    code = code.replace(/\.\.\/.*styles\/Examples\.module\.scss/, `./styles/Examples.module.scss`);
    await includeExternalModules(folderPath, folderPath, files, code, false, false);
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
