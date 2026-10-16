import type { IFiles } from "./sandboxDependencyUtils";

const postcss: typeof import("postcss") = require("postcss");
const selectorParser: typeof import("postcss-selector-parser") = require("postcss-selector-parser");

const classNamesInSelector = (selector: string) => {
    const classes: string[] = [];
    selectorParser((root) =>
        root.walkClasses((node) => {
            classes.push(node.value);
        })
    ).processSync(selector);
    return classes;
};

/* Negated classes are not prerequisites; nth-* arguments are positions, not element names. */
const usedSelector = (selector: string, classes: Set<string>, elements: Set<string>) => {
    const root = selectorParser().astSync(selector);
    const prune = (node: any): boolean => {
        if (node.type === "class") return classes.has(node.value);
        if (node.type === "tag") return elements.has(node.value.toLowerCase());
        if (
            node.type === "pseudo" &&
            [":not", ":nth-child", ":nth-last-child", ":nth-of-type", ":nth-last-of-type"].includes(node.value)
        ) {
            return true;
        }
        if (node.type === "pseudo" && [":is", ":where", ":has"].includes(node.value)) {
            for (const child of [...node.nodes]) {
                if (!prune(child)) child.remove();
            }
            return node.nodes.length > 0;
        }
        return !node.nodes || node.nodes.every(prune);
    };
    for (const child of [...root.nodes]) {
        if (!prune(child)) child.remove();
    }
    return root.toString();
};

const isUsedClass = (name: string, source: string) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^\\w-])${escapedName}(?=$|[^\\w-])`);
    // Utility words such as "flex" in style objects are not class names.
    const classAttributes = Array.from(
        source.matchAll(/\bclass(?:Name)?\s*[:=]\s*(?:["'`][^"'`]*["'`]|\{[^}]*\})/g),
        (match) => match[0]
    ).join("\n");
    return pattern.test(name.startsWith("sc-") ? source : classAttributes);
};

const variableReferences = (value: string) => Array.from(value.matchAll(/var\(\s*(--[\w-]+)/gi), (match) => match[1]);

const pruneNode = (node: any, classes: Set<string>, elements: Set<string>): any | undefined => {
    if (node.type === "comment") return undefined;
    if (node.type === "decl") return node;
    if (node.type === "rule") {
        node.selector = usedSelector(node.selector, classes, elements);
        if (!node.selector) return undefined;
    }
    if (Array.isArray(node.nodes)) {
        node.nodes = node.nodes.map((child: any) => pruneNode(child, classes, elements)).filter(Boolean);
        return node.nodes.length ? node : undefined;
    }
    return undefined;
};

/** Keep global rules and component rules referenced by the selected example's exported source. */
export const createExampleStylesheet = (entrySource: string, uiCss: string, localCss = "") => {
    const stylesheet = postcss.parse(uiCss);
    const availableClasses = new Set<string>();

    stylesheet.walkRules((rule: any) => {
        classNamesInSelector(rule.selector).forEach((name) => availableClasses.add(name));
    });

    const usedClasses = new Set(Array.from(availableClasses).filter((name) => isUsedClass(name, entrySource)));
    const usedElements = new Set(
        Array.from(entrySource.matchAll(/<\s*([a-z][\w-]*)\b/gi), (match) => match[1].toLowerCase())
    );
    ["html", "body"].forEach((name) => usedElements.add(name));
    stylesheet.nodes = stylesheet.nodes.map((node: any) => pruneNode(node, usedClasses, usedElements)).filter(Boolean);

    const definitions = new Map<string, string[]>();
    const neededVariables = new Set<string>(variableReferences(entrySource + "\n" + localCss));
    stylesheet.walkDecls((decl: any) => {
        if (decl.prop.startsWith("--")) {
            const values = definitions.get(decl.prop) ?? [];
            values.push(decl.value);
            definitions.set(decl.prop, values);
        } else {
            variableReferences(decl.value).forEach((name) => neededVariables.add(name));
        }
    });

    const pendingVariables = Array.from(neededVariables);
    while (pendingVariables.length > 0) {
        const name = pendingVariables.pop()!;
        for (const value of definitions.get(name) ?? []) {
            for (const dependency of variableReferences(value)) {
                if (!neededVariables.has(dependency)) {
                    neededVariables.add(dependency);
                    pendingVariables.push(dependency);
                }
            }
        }
    }
    stylesheet.walkDecls((decl: any) => {
        if (decl.prop.startsWith("--") && !neededVariables.has(decl.prop)) decl.remove();
    });

    // Token pruning can empty theme rules and their containing media queries.
    const removeEmpty = (node: any) => {
        if (!node.nodes) return;
        [...node.nodes].forEach(removeEmpty);
        if (node.type !== "root" && node.nodes.length === 0) node.remove();
    };
    removeEmpty(stylesheet);
    return stylesheet.toString().trim() + "\n";
};

/** Add the example-specific UI stylesheet without changing any example-owned stylesheets. */
export const useSingleExampleStylesheet = (
    files: IFiles,
    uiCss: string,
    entryFilePath: string,
    stylesheetImportPath?: string
): IFiles => {
    const output = Object.fromEntries(Object.entries(files).map(([name, file]) => [name, { ...file }]));
    const entryFile = output[entryFilePath];
    if (!entryFile) throw new Error(`Sandbox example source not found: ${entryFilePath}`);

    output["src/index.css"] = {
        content: createExampleStylesheet(
            Object.entries(output)
                .filter(([name, file]) => !file.isBinary && /\.(?:tsx?|jsx?|html)$/.test(name))
                .map(([, file]) => file.content)
                .join("\n"),
            uiCss,
            Object.entries(output)
                .filter(([name, file]) => name !== "src/index.css" && !file.isBinary && name.endsWith(".css"))
                .map(([, file]) => file.content)
                .join("\n")
        ),
        isBinary: false,
    };

    if (stylesheetImportPath) {
        const doubleQuotedImport = `import "${stylesheetImportPath}";`;
        const singleQuotedImport = `import '${stylesheetImportPath}';`;
        if (!entryFile.content.includes(doubleQuotedImport) && !entryFile.content.includes(singleQuotedImport)) {
            entryFile.content = `${doubleQuotedImport}\n${entryFile.content}`;
        }
    }

    return output;
};
