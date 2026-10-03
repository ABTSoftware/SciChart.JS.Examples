const ts = require("typescript");

// Keep titles, SEO fields and navigation synchronous. Long descriptions have their
// own ?description import; production/SSR do not run this development-only loader.
module.exports = function stripExampleMarkdown(source) {
    const file = ts.createSourceFile("exampleInfo.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const removedNames = new Set();
    const result = ts.transform(file, [
        (context) => {
            const visit = (node) => {
                if (
                    (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
                    node.name.getText(file).replace(/["']/g, "") === "markdownContent"
                ) {
                    const value = ts.isPropertyAssignment(node) ? node.initializer : node.name;
                    if (ts.isIdentifier(value)) removedNames.add(value.text);
                    return ts.factory.createPropertyAssignment(node.name, ts.factory.createNull());
                }
                return ts.visitEachChild(node, visit, context);
            };
            return (root) => ts.visitNode(root, visit);
        },
    ]);
    // Remove a detached markdown constant only when nothing else references it.
    const references = new Map();
    const count = (node) => {
        if (ts.isPropertyAssignment(node)) return count(node.initializer);
        if (ts.isIdentifier(node)) references.set(node.text, (references.get(node.text) || 0) + 1);
        ts.forEachChild(node, count);
    };
    count(result.transformed[0]);
    const statements = result.transformed[0].statements.filter(
        (statement) =>
            !ts.isVariableStatement(statement) ||
            statement.declarationList.declarations.length !== 1 ||
            !removedNames.has(statement.declarationList.declarations[0].name.getText(file)) ||
            references.get(statement.declarationList.declarations[0].name.getText(file)) !== 1
    );
    const output = ts.createPrinter().printFile(ts.factory.updateSourceFile(result.transformed[0], statements));
    result.dispose();
    return output;
};
