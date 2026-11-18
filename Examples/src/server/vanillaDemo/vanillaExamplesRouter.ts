import * as path from "path";
import express from "express";
import * as ts from "typescript";
import { htmlTemplate } from "./vanillaExampleHtmlTemplate";
import { EXAMPLES_PAGES } from "../../components/AppRouter/examplePages";
import { getSandboxConfig } from "../services/sandbox";
import { EPageFramework } from "../../helpers/shared/Helpers/frameworkTypes";
import { moduleReferences } from "../services/sandbox/sandboxDependencyUtils";

export const vanillaExamplesRouter = express.Router();
const basePath = path.join(__dirname, "Examples");
const projects = new Map<string, ReturnType<typeof getSandboxConfig>>();

vanillaExamplesRouter.get("/:example/:file", async (req, res, next) => {
    try {
        const currentExample = Object.values(EXAMPLES_PAGES).find((page) => page.path === req.params.example);
        if (!currentExample) return res.sendStatus(404);
        const filename = req.params.file;
        if (
            !["index.html", "index.js", "common.js", "scichart.browser.mjs", "styles.css"].includes(filename) &&
            !/^[\w.-]+\.js$/.test(filename)
        )
            return res.sendStatus(404);
        if (filename === "common.js" || filename === "scichart.browser.mjs")
            return res.sendFile(path.join(__dirname, filename));
        if (!projects.has(currentExample.path)) {
            const pending = getSandboxConfig(
                path.join(basePath, currentExample.filepath),
                currentExample,
                EPageFramework.Vanilla,
                ""
            );
            projects.set(currentExample.path, pending);
            void pending.catch(() => projects.delete(currentExample.path));
        }
        const { files } = await projects.get(currentExample.path);
        if (filename === "index.html") {
            const dependencies = JSON.parse(files["package.json"].content).dependencies as Record<string, string>;
            const imports: Record<string, string> = { scichart: "./scichart.browser.mjs" };
            for (const [name, version] of Object.entries(dependencies)) {
                if (name === "scichart") continue;
                imports[name] = `https://esm.sh/${name}@${version}`;
                imports[name + "/"] = `https://esm.sh/${name}@${version}/`;
            }
            return res.send(htmlTemplate({ imports, renderNav: !!req.query["nav"] }));
        }
        if (filename === "styles.css") return res.type("css").send(files["src/styles.css"].content);
        if (filename === "index.js") return res.type("js").send('import "./common.js";\nimport "./app.js";');
        const stem = filename.slice(0, -3);
        const file = files[`src/${stem}.ts`] ?? files[`src/${stem}.tsx`] ?? files[`src/${filename}`];
        if (!file || file.isBinary) return res.sendStatus(404);
        let code = ts.transpileModule(file.content, {
            compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
            fileName: stem + ".ts",
        }).outputText;
        // Exported dependencies are flattened; give native browser imports explicit extensions.
        for (const reference of moduleReferences(code, filename).reverse()) {
            if (!reference.text.startsWith(".")) continue;
            if (reference.text.endsWith(".css")) {
                if (ts.isImportDeclaration(reference.parent))
                    code = code.slice(0, reference.parent.getStart()) + code.slice(reference.parent.getEnd());
            } else if (!path.posix.extname(reference.text)) {
                const end = reference.getEnd() - 1;
                code = code.slice(0, end) + ".js" + code.slice(end);
            }
        }
        return res.type("js").send(code);
    } catch (error) {
        return next(error);
    }
});
