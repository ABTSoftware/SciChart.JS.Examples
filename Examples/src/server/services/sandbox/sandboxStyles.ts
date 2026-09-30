import { IFiles } from "./sandboxDependencyUtils";

const postcss: typeof import("postcss") = require("postcss");

const classNamesInSelector = (selector: string) =>
    Array.from(selector.matchAll(/\.([_a-zA-Z][\w-]*)/g), (match) => match[1]);

const elementNamesInSelector = (selector: string) =>
    Array.from(selector.matchAll(/(?:^|[\s>+~])([a-z][\w-]*)\b/gi), (match) => match[1].toLowerCase());

const splitSelectorList = (selector: string) => {
    const selectors: string[] = [];
    let start = 0;
    let depth = 0;
    let quote = "";
    let escaped = false;

    for (let i = 0; i < selector.length; i++) {
        const char = selector[i];
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (quote) {
            if (char === quote) quote = "";
        } else if (char === '"' || char === "'") quote = char;
        else if (char === "(" || char === "[") depth++;
        else if (char === ")" || char === "]") depth--;
        else if (char === "," && depth === 0) {
            selectors.push(selector.slice(start, i).trim());
            start = i + 1;
        }
    }

    selectors.push(selector.slice(start).trim());
    return selectors;
};

const isUsedClass = (name: string, source: string) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^\\w-])${escapedName}(?=$|[^\\w-])`);
    return pattern.test(source);
};

const variableReferences = (value: string) =>
    Array.from(value.matchAll(/var\(\s*(--[\w-]+)/gi), (match) => match[1]);

const isStateSelector = (selector: string) =>
    /:(?:active|checked|disabled|enabled|focus(?:-visible|-within)?|hover|invalid|open|valid)\b|\[\s*(?:aria-[\w-]+|checked|disabled|open|selected)\b/i.test(
        selector
    );

const pruneNode = (
    node: any,
    classes: Set<string>,
    elements: Set<string>,
    rootLevel: boolean,
    parentSelected: boolean
): any | undefined => {
    if (node.type === "decl" || node.type === "comment") return node;
    if (node.type === "rule") {
        const selectors = splitSelectorList(node.selector).filter((selector) => {
            const stateSelector = isStateSelector(selector);
            const requiredClasses = classNamesInSelector(
                stateSelector ? selector.replace(/:not\([^()]*\)/g, "") : selector
            );
            const selectorElements = elementNamesInSelector(selector);
            if (!requiredClasses.every((name) => classes.has(name))) return false;
            if (!rootLevel && !selectorElements.every((name) => elements.has(name))) return false;
            if (requiredClasses.length > 0 || stateSelector) return true;
            return rootLevel || parentSelected;
        });
        if (selectors.length === 0) return undefined;
        node.selector = selectors.join(", ");
        node.nodes = node.nodes.map((child: any) => pruneNode(child, classes, elements, false, true)).filter(Boolean);
        return node.nodes.length ? node : undefined;
    }
    if (Array.isArray(node.nodes)) {
        node.nodes = node.nodes
            .map((child: any) => pruneNode(child, classes, elements, rootLevel, parentSelected))
            .filter(Boolean);
        return node.nodes.length ? node : undefined;
    }
    return undefined;
};

/** Keep global rules and component rules referenced by the selected example's exported source. */
export const createExampleStylesheet = (entrySource: string, uiCss: string) => {
    const stylesheet = postcss.parse(uiCss);
    const availableClasses = new Set<string>();

    stylesheet.walkRules((rule: any) => {
        classNamesInSelector(rule.selector).forEach((name) => availableClasses.add(name));
    });

    const usedClasses = new Set(Array.from(availableClasses).filter((name) => isUsedClass(name, entrySource)));
    // ponytail: JSX tag scanning misses DOM emitted by components; parse rendered framework output if that needs exact pruning.
    const usedElements = new Set(
        Array.from(entrySource.matchAll(/<\s*([a-z][\w-]*)\b/gi), (match) => match[1].toLowerCase())
    );
    stylesheet.nodes = stylesheet.nodes
        .map((node: any) => pruneNode(node, usedClasses, usedElements, true, false))
        .filter(Boolean);

    const definitions = new Map<string, string[]>();
    const neededVariables = new Set<string>(variableReferences(entrySource));
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

    return stylesheet.toString();
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
        content: createExampleStylesheet(entryFile.content, uiCss),
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
