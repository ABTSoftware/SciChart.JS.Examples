import { IFiles, moduleReferences } from "./sandboxDependencyUtils";

const projectPackage = require("../../../../package.json");
const versions: Record<string, string> = {
    ...projectPackage.devDependencies,
    ...projectPackage.dependencies,
    "scichart-angular": "2.0.0",
};

/** Derive optional packages from the entire exported import graph. */
export const getExampleDependencies = (files: IFiles, overrides: Record<string, string> = {}) => {
    const dependencies: Record<string, string> = {};
    for (const [name, file] of Object.entries(files)) {
        if (file.isBinary || !/\.[jt]sx?$/.test(name)) continue;
        for (const reference of moduleReferences(file.content, name)) {
            const specifier = reference.text;
            if (/^(?:\.|\/|https?:|data:|node:)/.test(specifier)) continue;
            const packageName = specifier.startsWith("@")
                ? specifier.split("/").slice(0, 2).join("/")
                : specifier.split("/")[0];
            const version = overrides[packageName] ?? versions[packageName];
            if (!version) throw new Error(`No sandbox dependency version for ${packageName} (imported by ${name})`);
            dependencies[packageName] = version;
        }
    }
    return Object.fromEntries(Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b)));
};

export const jsonFile = (value: unknown) => ({ content: JSON.stringify(value, null, 4) + "\n", isBinary: false });
export const getPackageJson = (files: IFiles) => JSON.parse(files["package.json"].content);
