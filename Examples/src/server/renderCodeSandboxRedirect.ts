import * as path from "path";
import { Request, Response } from "express";
import { EXAMPLES_PAGES, TExamplePage } from "../components/AppRouter/examplePages";
import { IHttpError, NotFoundError } from "./Errors";
import { EPageFramework, EPlatform } from "../helpers/shared/Helpers/frameworkParametrization";
import { getParameters } from "./codeSandboxLib";
import { getSandboxConfig } from "./services/sandbox";
import { SandboxConfig, getSourceFilesForPath, loadStyles } from "./services/sandbox/sandboxDependencyUtils";
import { readSourceFiles } from "./services/sandbox/readSourceFiles";
import { getPackageJson } from "./services/sandbox/sandboxPackages";
import { SANDBOX_TEMPLATE } from "./services/sandbox/constants";
import { baseAppPath } from "../constants";
import { SourceFilesVariant } from "../helpers/types/types";

const renderCodeSandBoxRedirectPage = (config: SandboxConfig, framework: EPageFramework) => {
    const files = config.files;
    const template = SANDBOX_TEMPLATE;
    const parameters = getParameters({ files, template });

    const form = `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
        <input type="hidden" name="parameters" value="${parameters}" />
        <input type="hidden" name="query" value="file=src/drawExample.ts" />
        <input type="hidden" name="embed" value="1" />
        <input type="hidden" name="environment" value="server" />
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

const escapeHtmlAttribute = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// https://stackblitz.com/edit/sdk-angular-dependencies?file=project.ts,files.ts
const renderStackblitzRedirectPage = (config: SandboxConfig, framework: EPageFramework) => {
    const { "package.json": packageJsonFile, ...restFiles } = config.files;
    const packageJsonContent = escapeHtmlAttribute(packageJsonFile.content);
    const packageJson = getPackageJson(config.files);
    const allDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const dependenciesArgs = escapeHtmlAttribute(JSON.stringify(allDependencies));

    const filesArgs = Object.entries(restFiles).map(([filename, file]) => {
        const content = escapeHtmlAttribute(file.content);
        return `<input type="hidden" name="project[files][${filename}]" value="${content}">`;
    });

    const templateArg = SANDBOX_TEMPLATE;

    return `
    <html lang="en">
        <head></head>
        <body>
            <form id="mainForm" method="post" action="https://stackblitz.com/run" target="_self">
                ${filesArgs.join("\n")}
                <input type="hidden" name="project[description]" value="SciChart exported example">
                <input type="hidden" name="project[files][package.json]" value="${packageJsonContent}">
                <input type="hidden" name="project[dependencies]" value="${dependenciesArgs}">
                <input type="hidden" name="project[template]" value="${templateArg}">
                <input type="hidden" name="project[settings]" value="${escapeHtmlAttribute(
                    JSON.stringify({ compile: { clearConsole: false, action: "refresh", trigger: "save" } })
                )}">
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
const memoryCache: { [key: string]: { [fileName: string]: string } } = {};

// Get and cache source files for an example
export const cacheSourceFiles = async (exampleKey: string, folderPath: string, framework: EPageFramework) => {
    const cacheKey = `${exampleKey}:${framework}`;
    if (memoryCache[cacheKey]) return memoryCache[cacheKey];

    const files = await getSourceFilesForPath(
        folderPath,
        framework === EPageFramework.React ? "index.tsx" : "drawExample.js",
        ""
    );
    memoryCache[cacheKey] = Object.fromEntries(
        Object.entries(files).map(([filePath, file]) => {
            const fileName = path.isAbsolute(filePath)
                ? path.relative(folderPath, filePath).replace(/\\/g, "/")
                : filePath.replace(/^src\//, "");
            return [fileName, file.content];
        })
    );

    return memoryCache[cacheKey];
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

export const getSourceFiles = async (req: Request, res: Response): Promise<boolean> => {
    try {
        let currentExample: TExamplePage;
        try {
            currentExample = getRequestedExample(req, res)?.currentExample;
        } catch (err) {
            const error = err as IHttpError;
            res.status(error.status).send(error.status && error.message);
            return false;
        }

        try {
            let framework = req.query.framework as EPageFramework;
            const isValidFramework = Object.values(EPageFramework).includes(framework);
            if (!isValidFramework) {
                framework = EPageFramework.React;
            }

            const cachedResult = getCachedSourceFiles(currentExample.id, framework);

            if (cachedResult) {
                res.send(cachedResult);
            } else {
                const folderPath = path.join(basePath, currentExample.filepath);
                let baseUrl = req.protocol + "://" + req.get("host");
                const result = await readSourceFiles(framework, folderPath, baseUrl, undefined, currentExample);
                res.send(result);
            }

            return true;
        } catch (err) {
            console.warn(err);
            const error = err as IHttpError;
            if (error?.status) {
                res.status(error.status).send(error.message);
            } else {
                res.status(500).send("Internal server error");
            }
            return false;
        }
    } catch (err) {
        console.warn(err);
        res.status(500).send("Internal server error");
        return false;
    }
};

// Endpoint to get "drawExample.js" content and other file names
export const getDrawExampleFile = async (req: Request, res: Response) => {
    try {
        const { currentExample, currentExampleKey } = getRequestedExample(req, res);
        const framework = (req.query.framework as EPageFramework) || EPageFramework.React;
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

const CODESANDBOX_URL = "https://codesandbox.io/api/v1/sandboxes/define?json=1";
const sendCodeSandboxRequest = async (body: string) => {
    const response = await fetch(CODESANDBOX_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": `${Buffer.byteLength(body)}`,
        },
        body,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create sandbox: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    return response;
};

const getId = async (response: globalThis.Response) => {
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create sandbox: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const sandboxResponse = await response.json();
    const sandboxId = sandboxResponse.sandbox_id; // Extract the sandbox ID
    return sandboxId;
};

export const getSandboxUrlEndpoint = async (req: Request, res: Response) => {
    try {
        await loadStyles();
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
            let platform = req.query.platform as EPlatform;
            const isValidPlatform = Object.values(EPlatform).includes(platform);
            if (!isValidPlatform) {
                platform = EPlatform.CodeSandbox;
            }
            let baseUrl = req.protocol + "://" + req.get("host");
            const folderPath = path.join(basePath, currentExample.filepath);
            const { files, actualFramework } = await getSandboxConfig(folderPath, currentExample, framework, baseUrl);

            if (platform === EPlatform.CodeSandbox) {
                const template = SANDBOX_TEMPLATE;
                const parameters = getParameters({ files, template });
                const formData = new URLSearchParams();

                formData.append("parameters", parameters);

                formData.append("environment", "server");

                formData.append("embed", "1");
                formData.append("query", "file=src/drawExample.ts");
                const sbres = await sendCodeSandboxRequest(formData.toString()); // may fail
                const id = await getId(sbres);
                res.status(200).json({ id, actualFramework });
            } else {
                const url = new URL(
                    `${baseAppPath}/stackblitz/${currentExample.path}?framework=${actualFramework}`,
                    baseUrl
                ).href;
                res.status(200).json({ url, actualFramework });
            }
        } catch (err) {
            console.warn(err);
            const error = err as IHttpError;
            if (error?.status === 404) {
                const alternativeLink = `/codesandbox/${currentExample.path}?codesandbox=1&framework=${EPageFramework.React}`;
                res.json({ error: "Example not found", alternativeUrl: alternativeLink });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    } catch (err) {
        console.warn(err);
        res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200);
};

export const renderSandBoxRedirect = async (
    req: Request,
    res: Response,
    sandboxEnv: "codesandbox" | "stackblitz"
): Promise<boolean> => {
    try {
        await loadStyles();
        let currentExample: TExamplePage;
        try {
            currentExample = getRequestedExample(req, res)?.currentExample;
        } catch (err) {
            const error = err as IHttpError;
            res.status(error.status).send(error.status && error.message);
            return false;
        }

        try {
            let framework = req.query.framework as EPageFramework;
            const isValidFramework = Object.values(EPageFramework).includes(framework);
            if (!isValidFramework) {
                framework = EPageFramework.React;
            }
            let baseUrl = req.protocol + "://" + req.get("host");
            const folderPath = path.join(basePath, currentExample.filepath);
            const sandboxConfig = await getSandboxConfig(folderPath, currentExample, framework, baseUrl);

            const page =
                sandboxEnv === "codesandbox"
                    ? renderCodeSandBoxRedirectPage(sandboxConfig, sandboxConfig.actualFramework)
                    : renderStackblitzRedirectPage(sandboxConfig, sandboxConfig.actualFramework);
            res.send(page);
            return true;
        } catch (err) {
            console.warn(err);
            const error = err as IHttpError;
            if (error?.status === 404) {
                const page = notFoundCodeSandBoxRedirectPage(currentExample);
                res.send(page);
                return true;
            }
            res.status(error?.status || 500).send(error?.message || "Internal server error");
            return false;
        }
    } catch (err) {
        console.warn(err);
        res.status(500).send("Internal server error");
        return false;
    }
};

export { readSourceFiles } from "./services/sandbox/readSourceFiles";

type ExampleSourceFilesPerFramework = { [value in EPageFramework]: SourceFilesVariant };
const sourceFilesCache = new Map<string, ExampleSourceFilesPerFramework>(
    Object.keys(EXAMPLES_PAGES).map((exampleKey) => [exampleKey, {} as ExampleSourceFilesPerFramework])
);

// Get and cache source files for an example
const cacheSourceFilesVariant = async (exampleKey: string, folderPath: string, framework: EPageFramework) => {
    const result: SourceFilesVariant = await readSourceFiles(
        framework,
        folderPath,
        "",
        undefined,
        EXAMPLES_PAGES[exampleKey]
    );
    sourceFilesCache.get(exampleKey)[framework] = result;

    return result;
};

export const getSourceFilesForExample = (exampleKey: string, framework: EPageFramework) => {
    const currentExample = EXAMPLES_PAGES[exampleKey];
    const folderPath = path.join(basePath, currentExample.filepath);
    return cacheSourceFilesVariant(exampleKey, folderPath, framework);
};

export const populateSourceFilesCache = async () => {
    for (let framework of Object.values(EPageFramework)) {
        for (let key in EXAMPLES_PAGES) {
            await getSourceFilesForExample(key, framework);
        }
    }
};

export const getCachedSourceFiles = (exampleKey: string, framework: EPageFramework) => {
    const sourceFilesForExample = sourceFilesCache.get(exampleKey);
    return sourceFilesForExample ? sourceFilesForExample[framework] : null;
};
