import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";

export interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}

const folderPath = path.join(__dirname, "Examples");

export let csStyles: IFiles;
export const loadStyles = async (stylesPath = path.join(folderPath, "styles")) => {
    if (!csStyles) {
        const ui = await fs.promises.readFile(path.join(stylesPath, "sc-ui.css"), "utf8");
        csStyles = {
            "src/index.css": { content: ui, isBinary: false },
        };
    }
};

export type SandboxConfig = { files: IFiles };

export const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error(`Invalid framework value=${value}!`);
};

const resolveSuffixes = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"];

const resolveModuleFile = async (basePath: string) => {
    for (const suffix of resolveSuffixes) {
        const filepath = path.normalize(basePath + suffix);
        try {
            return { filepath, content: await fs.promises.readFile(filepath, "utf8") };
        } catch (error) {
            if (!["ENOENT", "EISDIR", "ENOTDIR"].includes((error as NodeJS.ErrnoException).code)) throw error;
        }
    }
    throw new Error(`Example import not found: ${basePath}`);
};

/** Copy the complete relative import graph, preserving directories to avoid CSS/name collisions. */
export const includeExternalModules = async (
    exampleFolderPath: string,
    folderPath: string,
    files: IFiles,
    content: string,
    includeImages: boolean,
    updateImports: boolean,
    baseUrl = "https://www.scichart.com/demo/images/"
) => {
    const outputPath = (filepath: string) =>
        "src/" +
        path
            .relative(exampleFolderPath, filepath)
            .replace(/\\/g, "/")
            .replace(/^(?:\.\.\/)+/, "_shared/");

    const visit = async (source: string, directory: string, ownerPath: string): Promise<string> => {
        const imports = ts
            .createSourceFile(ownerPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
            .statements.flatMap((statement) => {
                if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) return [];
                const specifier = statement.moduleSpecifier;
                return specifier && ts.isStringLiteral(specifier) && specifier.text.startsWith(".") ? [specifier] : [];
            });
        // Rewrite from the end so earlier match positions remain valid.
        for (const match of imports.reverse()) {
            const specifier = match.text;
            const basePath = path.resolve(directory, specifier);
            if (/\.scss$/.test(specifier)) continue;
            const isImage = /\.(?:png|jpe?g|gif|svg)$/i.test(specifier);
            if (isImage && !includeImages) continue;
            const resolved = isImage ? { filepath: basePath, content: "" } : await resolveModuleFile(basePath);
            const targetPath = outputPath(resolved.filepath);
            if (!files[targetPath]) {
                // Store before recursing so circular imports terminate.
                files[targetPath] = {
                    content: isImage
                        ? new URL("/demo/images/" + path.basename(basePath), baseUrl || "https://www.scichart.com").href
                        : resolved.content,
                    isBinary: isImage,
                };
                if (/\.[jt]sx?$/.test(resolved.filepath)) {
                    files[targetPath].content = await visit(
                        resolved.content,
                        path.dirname(resolved.filepath),
                        targetPath
                    );
                }
            }
            if (updateImports) {
                let relative = path.posix.relative(path.posix.dirname(ownerPath), targetPath);
                if (/\.[jt]sx?$/.test(relative)) relative = relative.replace(/\.[jt]sx?$/, "");
                if (!relative.startsWith(".")) relative = "./" + relative;
                const start = match.getStart() + 1;
                source = source.slice(0, start) + relative + source.slice(start + specifier.length);
            }
        }
        return source;
    };

    return visit(content, folderPath, "src/__entry.ts");
};

export const includeImportedModules = async (
    folderPath: string,
    files: IFiles,
    code: string,
    includeImages: boolean,
    updateImports: boolean,
    baseUrl: string
) => {
    await includeExternalModules(folderPath, folderPath, files, code, includeImages, updateImports, baseUrl);
};

export const getSourceFilesForPath = async (folderPath: string, startFile: string, baseUrl: string) => {
    const tsPath = path.join(folderPath, startFile);
    const code = await fs.promises.readFile(tsPath, "utf8");
    const files: IFiles = { [tsPath]: { content: code, isBinary: false } };
    await includeImportedModules(folderPath, files, code, false, false, baseUrl);
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
