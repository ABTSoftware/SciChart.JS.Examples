import * as path from "path";
import * as fs from "fs";
import { Request, Response } from "express";
import { EXAMPLES_PAGES, TExamplePage } from "../components/AppRouter/examplePages";
import { BadRequestError, IHttpError, NotFoundError } from "./Errors";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
import { getParameters } from "codesandbox/lib/api/define";
import { getSandboxConfig } from "./services/sandbox";
import { SandboxConfig, IFiles, getSourceFilesForPath, loadStyles } from "./services/sandbox/sandboxDependencyUtils";
import { indexHtmlTemplate } from "./services/sandbox/vanillaTsConfig";

const renderCodeSandBoxRedirectPage = (config: SandboxConfig, framework: EPageFramework) => {
    const files = config.files;
    const openInDevBox = framework === EPageFramework.Angular;
    const template = getCodeSandboxTemplate(framework);
    const parameters = getParameters({ files, template });

    const form = `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
        <input type="hidden" name="parameters" value="${parameters}" />
        <input type="hidden" name="query" value="file=src/drawExample.ts" />
        <input type="hidden" name="embed" value="1" />
        ${openInDevBox ? `<input type="hidden" name="environment" value="server" />` : ""}
    </form>`;

    return `
    <html lang="en-us">
      <head>
          <meta charset="utf-8" />
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <meta name="robots" content="noindex" />
          <title>SciChart.js Documentation Examples</title>
      </head>
      <body>
        <p>Redirecting To codesandbox...</p>
        ${form}
        <script type="text/javascript">
          document.querySelector("#codesandbox").submit();
        </script>
      </body>
  </html>`;
};

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, "g"), replace);
}

// https://stackblitz.com/edit/sdk-angular-dependencies?file=project.ts,files.ts
const renderStackblitzRedirectPage = (config: SandboxConfig, framework: EPageFramework) => {
    const { "package.json": packageJsonFile, ...restFiles } = config.files;
    const packageJsonContent = replaceAll(JSON.stringify(packageJsonFile.content, null, 2), '"', `&quot;`);
    // @ts-ignore
    const allDependencies = { ...packageJsonFile.content.dependencies, ...packageJsonFile.content.devDependencies };
    const dependenciesArgs = replaceAll(JSON.stringify(allDependencies, null, 2), '"', `&quot;`);

    const filesArgs = Object.entries(restFiles).map(([filename, file]) => {
        const content = replaceAll(file.content, '"', `&quot;`);
        return `<input type="hidden" name="project[files][${filename}]" value="${content}">`;
    });

    const templateArg = getStackblitzTemplate(framework);

    return `
    <html lang="en">
        <head></head>
        <body>
            <form id="mainForm" method="post" action="https://stackblitz.com/run" target="_self">
                ${filesArgs.join()}
                <input type="hidden" name="project[description]" value="SciChart exported example">
                <input type="hidden" name="project[files][package.json]" value="${packageJsonContent}">
                <input type="hidden" name="project[dependencies]" value="${dependenciesArgs}">
                <input type="hidden" name="project[template]" value="${templateArg}">
                <input type="hidden" name="project[settings]" value="{&quot;compile&quot;:{&quot;clearConsole&quot;:false, &quot;action&quot;:'refresh', &quot;trigger&quot;: 'save'}}">
            </form>
            <script>
                document.getElementById("mainForm").submit();
        </script>
      </body>
  </html>`;
};

const notFoundCodeSandBoxRedirectPage = (page: TExamplePage) => {
    const alternativeLink = `/codesandbox/${page.path}?codesandbox=1&framework=${EPageFramework.React}`;
    return `
    <html lang="en-us">
      <head>
          <meta charset="utf-8" />
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <meta name="robots" content="noindex" />
          <title>CodeSandbox Redirect Form</title>
      </head>
      <body>
        <p>The requested codesandbox example version doesn't exist. Try selecting other framework</p>
        <a href="${alternativeLink}" >React Example</a>
      </body>
  </html>`;
};

const basePath = path.join(__dirname, "Examples");
const memoryCache: {[key: string]: {[fileName: string]: string } } = {};

// Get and cache source files for an example
export const cacheSourceFiles = async (exampleKey: string, folderPath: string, framework: EPageFramework) => {
    if (memoryCache[exampleKey]) return memoryCache[exampleKey];

    const files = await getSourceFilesForPath(folderPath, framework === EPageFramework.React ? "index.tsx" : "drawExample.js", "");
    memoryCache[exampleKey] = Object.fromEntries(
        Object.entries(files).map(([filePath, file]) => {
            const fileName = path.basename(filePath);
            return [fileName, file.content];
        })
    );

    return memoryCache[exampleKey];
};

export const getRequestedExample = (req: Request, res: Response) => {
    const examplePath = req.params.example;
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === examplePath);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];

    if (!currentExample) {
        throw new NotFoundError(`Example ${examplePath} doesn't exist!`);
    }

    return { currentExample, currentExampleKey };
};

export const getSourceFiles = async (req: Request, res: Response) => {
    try {
        let currentExample: TExamplePage;
        try {
            currentExample = getRequestedExample(req, res)?.currentExample;
        } catch (err) {
            const error = err as IHttpError;
            return res.status(error.status).send(error.status && error.message);
        }

        try {
            let framework = req.query.framework as EPageFramework;
            const isValidFramework = Object.values(EPageFramework).includes(framework);
            if (!isValidFramework) {
                framework = EPageFramework.React;
            }
            // console.log("Get source files for ", currentExample.title, framework);
            const folderPath = path.join(basePath, currentExample.filepath);
            let files: IFiles = {};
            let htmlPath: string;
            let html: string;
            let baseUrl = req.protocol + "://" + req.get("host");
            switch (framework) {
                case EPageFramework.Angular:
                    files = await getSourceFilesForPath(folderPath, "angular.ts", baseUrl);
                    break;
                case EPageFramework.Vue:
                    throw new Error("Not Implemented");
                case EPageFramework.React:
                    files = await getSourceFilesForPath(folderPath, "index.tsx", baseUrl);
                    break;
                case EPageFramework.Vanilla:
                    files = await getSourceFilesForPath(folderPath, "vanilla.ts", baseUrl);
                    htmlPath = path.join(folderPath, "index.html");
                    try {
                        const charHtmlSetup = await fs.promises.readFile(htmlPath, "utf8");
                        html = indexHtmlTemplate(charHtmlSetup);
                    } catch (err) {
                        html = indexHtmlTemplate();
                    }
                    files[htmlPath] = { content: html, isBinary: false };
                    break;
                default:
                    throw new Error("Invalid framework value!");
            }
            const result: { name: string; content: string }[] = [];
            for (const key in files) {
                // console.log(key);
                const sep = key.indexOf("/") > 0 ? "/" : "\\";
                const name = key.substring(key.lastIndexOf(sep) + 1);
                result.push({ name, content: files[key].content });
            }
            res.send(result);
        } catch (err) {
            // check if expected error type
            console.warn(err);
            const error = err as IHttpError;
        }
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

// Endpoint to get "drawExample.js" content and other file names
export const getDrawExampleFile = async (req: Request, res: Response) => {
    try {
        const { currentExample, currentExampleKey } = getRequestedExample(req, res);
        const framework = req.query.framework as EPageFramework || EPageFramework.React;
        const folderPath = path.join(basePath, currentExample.filepath);

        // Load or retrieve cached files
        const cachedFiles = await cacheSourceFiles(currentExampleKey, folderPath, framework);

        // Respond with "drawExample.js" content and other file names
        const response = Object.entries(cachedFiles).map(([fileName, content]) => 
            fileName === "drawExample.js" ? { name: fileName, content } : { name: fileName, content: null }
        );
        res.send(response);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving example files");
    }
};

export const renderSandBoxRedirect = async (req: Request, res: Response, sandboxEnv: "codesandbox" | "stackblitz") => {
    try {
        await loadStyles(basePath);
        let currentExample: TExamplePage;
        try {
            currentExample = getRequestedExample(req, res)?.currentExample;
        } catch (err) {
            const error = err as IHttpError;
            return res.status(error.status).send(error.status && error.message);
        }

        try {
            let framework = req.query.framework as EPageFramework;
            const isValidFramework = Object.values(EPageFramework).includes(framework);
            if (!isValidFramework) {
                framework = EPageFramework.React;
            }
            let baseUrl = req.protocol + "://" + req.get("host");
            const folderPath = path.join(basePath, currentExample.filepath);
            const sandboxConfig = await getSandboxConfig(
                folderPath,
                currentExample,
                req.query.framework as EPageFramework,
                baseUrl
            );
            const page =
                sandboxEnv === "codesandbox"
                    ? renderCodeSandBoxRedirectPage(sandboxConfig, framework)
                    : renderStackblitzRedirectPage(sandboxConfig, framework);
            res.send(page);
        } catch (err) {
            // check if expected error type
            console.warn(err);
            const error = err as IHttpError;
            if (error?.status === 404) {
                const page = notFoundCodeSandBoxRedirectPage(currentExample);
                res.send(page);
            }
        }
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error("Invalid framework value!");
};

const getStackblitzTemplate = (framework: EPageFramework) => {
    switch (framework) {
        case EPageFramework.Angular:
            return "node";
        case EPageFramework.Vue:
            return "vue";
        case EPageFramework.React:
            return "create-react-app";
        case EPageFramework.Vanilla:
            return "typescript";
        default:
            return handleInvalidFrameworkValue(framework);
    }
};

const getCodeSandboxTemplate = (framework: EPageFramework) => {
    switch (framework) {
        case EPageFramework.Angular:
            return "angular-cli";
        case EPageFramework.Vue:
            return "vue-cli";
        case EPageFramework.React:
            return "create-react-app";
        case EPageFramework.Vanilla:
            return "parcel";
        default:
            return handleInvalidFrameworkValue(framework);
    }
};
