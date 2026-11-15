const postcss: typeof import("postcss") = require("postcss");
const selectorParser: typeof import("postcss-selector-parser") = require("postcss-selector-parser");
import * as ts from "typescript";

const sourceClasses = (source: string) => {
    const strings: string[] = [];
    const attributes: string[] = [];
    const elements: string[] = [];
    const visit = (node: ts.Node, includeStrings: boolean) => {
        if (
            includeStrings &&
            (ts.isStringLiteralLike(node) ||
                node.kind === ts.SyntaxKind.TemplateHead ||
                node.kind === ts.SyntaxKind.TemplateMiddle ||
                node.kind === ts.SyntaxKind.TemplateTail)
        ) {
            const text = (node as ts.StringLiteralLike).text;
            strings.push(text);
            for (const match of text.matchAll(/\bclass(?:Name)?\s*[:=]\s*["']([^"']*)["']/g)) attributes.push(match[1]);
        }
        if (ts.isJsxAttribute(node) && ["class", "className"].includes(node.name.getText())) {
            if (node.initializer) attributes.push(node.initializer.getText());
        }
        if (ts.isParameter(node) && node.name.getText() === "className" && node.initializer) {
            attributes.push(node.initializer.getText());
        }
        // h("div", { class: "flex gap-2" }) and other object-literal class props.
        if (
            ts.isPropertyAssignment(node) &&
            (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
            ["class", "className"].includes(node.name.text)
        ) {
            attributes.push(node.initializer.getText());
        }
        if (ts.isCallExpression(node)) {
            if (ts.isIdentifier(node.expression) && ["element", "h"].includes(node.expression.text)) {
                if (node.arguments[0] && ts.isStringLiteral(node.arguments[0])) elements.push(node.arguments[0].text);
                if (node.expression.text === "element" && node.arguments[2])
                    attributes.push(node.arguments[2].getText());
            }
            if (ts.isPropertyAccessExpression(node.expression)) {
                const tag =
                    node.expression.name.text === "createElement"
                        ? node.arguments[0]
                        : node.expression.name.text === "createElementNS"
                        ? node.arguments[1]
                        : undefined;
                if (tag && ts.isStringLiteral(tag)) elements.push(tag.text);
                if (node.expression.name.text === "chart" && node.arguments[2])
                    attributes.push(node.arguments[2].getText());
                if (
                    ["add", "toggle", "replace"].includes(node.expression.name.text) &&
                    node.expression.expression.getText().endsWith(".classList")
                ) {
                    attributes.push(...node.arguments.map((argument) => argument.getText()));
                }
                if (
                    node.expression.name.text === "setAttribute" &&
                    node.arguments[0]?.getText().slice(1, -1) === "class" &&
                    node.arguments[1]
                ) {
                    attributes.push(node.arguments[1].getText());
                }
            }
        }
        if (
            ts.isBinaryExpression(node) &&
            node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            ts.isPropertyAccessExpression(node.left) &&
            node.left.name.text === "className"
        ) {
            attributes.push(node.right.getText());
        }
        ts.forEachChild(node, (child) => visit(child, includeStrings));
    };
    // Generic TS arrows are not valid TSX. The TS pass only adds explicit DOM class usage.
    for (const kind of [ts.ScriptKind.TSX, ts.ScriptKind.TS]) {
        visit(ts.createSourceFile("example", source, ts.ScriptTarget.Latest, true, kind), kind === ts.ScriptKind.TSX);
    }
    return { strings: [...strings, ...attributes].join("\n"), attributes: attributes.join("\n"), elements };
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
    // Standalone examples always use navy, regardless of the host OS theme.
    stylesheet.walkAtRules("media", (rule) => {
        if (/prefers-color-scheme/.test(rule.params)) rule.remove();
    });
    const navyRules = new Set<import("postcss").Rule>();
    stylesheet.walkRules((rule) => {
        if (/\[data-theme\s*=\s*["']?navy["']?\]/.test(rule.selector)) navyRules.add(rule);
        const selectors = rule.selectors
            .map((selector) => selector.replace(/\[data-theme\s*=\s*["']?navy["']?\]/g, "").trim())
            .filter((selector) => !selector.includes("data-theme"))
            .map((selector) => selector || ":root");
        if (!selectors.length) rule.remove();
        else rule.selectors = [...new Set(selectors)];
    });
    // Bake navy declarations into their base rules before discarding the theme selector's specificity.
    for (const rule of navyRules) {
        if (!rule.parent || !rule.nodes.every((node) => node.type === "decl" || node.type === "comment")) continue;
        const base = rule.parent.nodes.find(
            (node): node is import("postcss").Rule =>
                node.type === "rule" && node !== rule && !navyRules.has(node) && node.selector === rule.selector
        );
        if (!base) continue;
        for (const node of [...rule.nodes]) {
            if (node.type !== "decl") continue;
            for (const existing of [...base.nodes]) {
                if (existing.type === "decl" && existing.prop === node.prop) existing.remove();
            }
            const nested = base.nodes.find((child) => child.type === "rule" || child.type === "atrule");
            if (nested) base.insertBefore(nested, node);
            else base.append(node);
        }
        rule.remove();
    }
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
    usage.elements.forEach((name) => usedElements.add(name));
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
    // Utilities use !important, so grouping them here preserves their precedence over component rules.
    const utilities = stylesheet.nodes.filter(
        (node): node is import("postcss").Rule =>
            node.type === "rule" && node.selectors.every((selector) => /^\.(?!sc-)[\w-]+$/.test(selector))
    );
    const root = stylesheet.nodes.find((node) => node.type === "rule" && node.selector === ":root");
    utilities.forEach((rule) => rule.remove());
    if (root) stylesheet.insertAfter(root, utilities);
    else stylesheet.prepend(...utilities);
    // Formatting is a build concern; exported CSS must never pass through the app's minifier.
    const prettier = require("prettier");
    return prettier.format(stylesheet.toString() + "\n" + localCss, { parser: "css", tabWidth: 4, printWidth: 110 });
};
