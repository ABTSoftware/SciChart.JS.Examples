const postcss: typeof import("postcss") = require("postcss");
const selectorParser: typeof import("postcss-selector-parser") = require("postcss-selector-parser");
import * as ts from "typescript";

const sourceClasses = (source: string) => {
    const strings: string[] = [];
    const attributes: string[] = [];
    const visit = (node: ts.Node) => {
        if (
            ts.isStringLiteralLike(node) ||
            node.kind === ts.SyntaxKind.TemplateHead ||
            node.kind === ts.SyntaxKind.TemplateMiddle ||
            node.kind === ts.SyntaxKind.TemplateTail
        ) {
            const text = (node as ts.StringLiteralLike).text;
            strings.push(text);
            for (const match of text.matchAll(/\bclass(?:Name)?\s*[:=]\s*["']([^"']*)["']/g)) attributes.push(match[1]);
        }
        if (ts.isJsxAttribute(node) && ["class", "className"].includes(node.name.getText())) {
            if (node.initializer) attributes.push(node.initializer.getText());
        }
        ts.forEachChild(node, visit);
    };
    visit(ts.createSourceFile("example.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX));
    return { strings: strings.join("\n"), attributes: attributes.join("\n") };
};

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

const isUsedClass = (name: string, usage: ReturnType<typeof sourceClasses>) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^\\w-])${escapedName}(?=$|[^\\w-])`);
    // Utility words such as "flex" in style objects are not class names.
    return pattern.test(name.startsWith("sc-") ? usage.strings : usage.attributes);
};

const variableReferences = (value: string) => Array.from(value.matchAll(/var\(\s*(--[\w-]+)/gi), (match) => match[1]);

const pruneNode = (node: any, classes: Set<string>, elements: Set<string>): any | undefined => {
    if (node.type === "comment") return undefined;
    if (node.type === "decl") return node;
    if (node.type === "atrule" && /keyframes$/i.test(node.name)) return node;
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
    // Gallery typography should not resize the root of a standalone project.
    stylesheet.walkRules(":root", (rule) => {
        const parent = rule.parent;
        if (parent?.type === "atrule" && parent.name === "media" && /^\(min-width:\s*\d+px\)$/.test(parent.params)) {
            rule.walkDecls("font-size", (decl) => {
                decl.remove();
            });
        }
    });
    const availableClasses = new Set<string>();

    stylesheet.walkRules((rule: any) => {
        classNamesInSelector(rule.selector).forEach((name) => availableClasses.add(name));
    });

    const usage = sourceClasses(entrySource);
    const usedClasses = new Set(Array.from(availableClasses).filter((name) => isUsedClass(name, usage)));
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
    const values: string[] = [];
    stylesheet.walkDecls((decl: any) => {
        if (!(decl.parent.type === "atrule" && decl.parent.name === "font-face")) values.push(decl.value);
    });
    const referencedValues = values.join(" ") + " " + localCss;
    stylesheet.walkAtRules((rule: any) => {
        if (/keyframes$/i.test(rule.name) && !referencedValues.includes(rule.params)) rule.remove();
        if (rule.name === "font-face") {
            const family = rule.nodes.find((node: any) => node.prop === "font-family")?.value.replace(/["']/g, "");
            if (!family || !referencedValues.includes(family)) rule.remove();
        }
    });
    // Formatting is a build concern; exported CSS must never pass through the app's minifier.
    const prettier = require("prettier");
    return prettier.format(stylesheet.toString() + "\n" + localCss, { parser: "css", tabWidth: 4, printWidth: 110 });
};
