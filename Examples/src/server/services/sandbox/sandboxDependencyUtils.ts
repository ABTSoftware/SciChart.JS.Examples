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

/** Literal module references, including lazy imports and CommonJS helpers. */
export const moduleReferences = (source: string, filename: string) => {
    const references: ts.StringLiteralLike[] = [];
    const visit = (node: ts.Node) => {
        if (
            (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
            node.moduleSpecifier &&
            ts.isStringLiteral(node.moduleSpecifier)
        )
            references.push(node.moduleSpecifier);
        if (
            ts.isCallExpression(node) &&
            node.arguments.length === 1 &&
            ts.isStringLiteralLike(node.arguments[0]) &&
            (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
                (ts.isIdentifier(node.expression) && node.expression.text === "require"))
        )
            references.push(node.arguments[0]);
        if (
            ts.isImportTypeNode(node) &&
            ts.isLiteralTypeNode(node.argument) &&
            ts.isStringLiteral(node.argument.literal)
        )
            references.push(node.argument.literal);
        if (ts.isExternalModuleReference(node) && node.expression && ts.isStringLiteral(node.expression))
            references.push(node.expression);
        ts.forEachChild(node, visit);
    };
    visit(ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX));
    return references;
};

/** Export helpers beside the example; disambiguate duplicate basenames without leaking app paths. */
export const includeExternalModules = async (
    exampleFolderPath: string,
    folderPath: string,
    files: IFiles,
    content: string,
    includeImages: boolean,
    updateImports: boolean,
    baseUrl = "https://www.scichart.com/demo/images/",
    entryPath = "src/__entry.ts",
    sourceFilename?: string
) => {
    const targets = new Map<string, string>();
    const occupied = new Set([...Object.keys(files), entryPath, "src/main.tsx", "src/main.ts", "src/styles.css"]);
    if (sourceFilename) targets.set(path.resolve(folderPath, sourceFilename), entryPath);
    const outputPath = (filepath: string) => {
        if (targets.has(filepath)) return targets.get(filepath)!;
        const basename = path.basename(filepath);
        const name = basename === "theme.ts" && path.dirname(filepath) !== exampleFolderPath ? "appTheme.ts" : basename;
        let target = "src/" + name;
        let suffix = 2;
        while (occupied.has(target)) {
            const extension = path.extname(name);
            target = `src/${path.basename(name, extension)}${suffix++}${extension}`;
        }
        targets.set(filepath, target);
        occupied.add(target);
        return target;
    };

    const visit = async (source: string, directory: string, ownerPath: string): Promise<string> => {
        const imports = moduleReferences(source, ownerPath).filter((specifier) => specifier.text.startsWith("."));
        const replacements: { start: number; end: number; text: string }[] = [];
        for (const match of imports) {
            const specifier = match.text;
            const basePath = path.resolve(directory, specifier);
            const isImage = /\.(?:png|jpe?g|gif|svg|webp|ico)$/i.test(specifier);
            if (isImage && !includeImages) continue;
            if (isImage && updateImports && ts.isImportDeclaration(match.parent) && match.parent.importClause?.name) {
                const url = new URL("/demo/images/" + path.basename(basePath), baseUrl || "https://www.scichart.com")
                    .href;
                // StackBlitz files are text-only: keep hosted images as URLs instead of counterfeit image files.
                replacements.push({
                    start: match.parent.getStart(),
                    end: match.parent.getEnd(),
                    text: `const ${match.parent.importClause.name.text} = ${JSON.stringify(url)};`,
                });
                continue;
            }
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
                replacements.push({ start, end: start + specifier.length, text: relative });
            }
        }
        for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
            source = source.slice(0, replacement.start) + replacement.text + source.slice(replacement.end);
        }
        return source;
    };

    return visit(content, folderPath, entryPath);
};

export const getSourceFilesForPath = async (
    folderPath: string,
    startFile: string,
    baseUrl: string,
    targetName = startFile
) => {
    const tsPath = path.join(folderPath, startFile);
    const code = await fs.promises.readFile(tsPath, "utf8");
    const entryPath = "src/" + targetName;
    const files: IFiles = { [entryPath]: { content: code, isBinary: false } };
    files[entryPath].content = await includeExternalModules(
        folderPath,
        folderPath,
        files,
        code,
        true,
        true,
        baseUrl,
        entryPath,
        startFile
    );
    return files;
};
