import * as path from "path";
import * as fs from "fs";
import { Request, Response } from "express";
import { EXAMPLES_PAGES, TExamplePage } from "../components/AppRouter/examplePages";
import { BadRequestError, IHttpError, NotFoundError } from "./Errors";
import { EPageFramework, EPlatform } from "../helpers/shared/Helpers/frameworkParametrization";
import { getParameters } from "codesandbox/lib/api/define";
import { getSandboxConfig } from "./services/sandbox";
import { SandboxConfig, IFiles, getSourceFilesForPath, loadStyles } from "./services/sandbox/sandboxDependencyUtils";
import { indexHtmlTemplate } from "./services/sandbox/vanillaTsConfig";
import https from "https";
import { parse } from "node-html-parser"; // Install: npm install node-html-parser
import { ExampleSourceFile, SourceFilesVariant } from "../helpers/types/types";

//  const parameters = getParameters({ files, template:  getCodeSandboxTemplate(framework) });

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

function postAndCaptureRedirect(url: string, data: any): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(JSON.stringify(data)),
            },
        };

        const req = https.request(options, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
                // Redirect occurred
                if (res.headers.location) {
                    resolve(res.headers.location); // Capture and return redirect URL
                } else {
                    resolve(null); // No location header in redirect
                }
            } else {
                resolve(null); // No redirect
            }
        });

        req.on("error", (err) => {
            reject(err); // Handle request errors
        });

        // Write data to the request body
        req.write(JSON.stringify(data));
        req.end();
    });
}
const STATCKBLITZ_URL = "https://stackblitz.com/run";

// Function to get Stackblitz URL directly
const getStackblitzData = async (config: SandboxConfig, framework: EPageFramework) => {
    const { "package.json": packageJsonFile, ...restFiles } = config.files;
    // @ts-ignore
    const allDependencies = { ...packageJsonFile.content.dependencies, ...packageJsonFile.content.devDependencies };

    const templateArg = getStackblitzTemplate(framework);

    const formData = new URLSearchParams();

    // Add files
    Object.entries(restFiles).forEach(([filename, file]) => {
        formData.append(`project[files][${filename}]`, file.content);
    });

    // Add package.json
    formData.append("project[files][package.json]", JSON.stringify(packageJsonFile.content, null, 2));
    formData.append("project[dependencies]", JSON.stringify(allDependencies, null, 2));
    formData.append("project[template]", templateArg);
    formData.append("project[description]", "SciChart exported example");
    formData.append(
        "project[settings]",
        JSON.stringify({
            compile: {
                clearConsole: false,
                action: "refresh",
                trigger: "save",
            },
        })
    );
    return formData.toString();
};

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
const memoryCache: { [key: string]: { [fileName: string]: string } } = {};

// Get and cache source files for an example
export const cacheSourceFiles = async (exampleKey: string, folderPath: string, framework: EPageFramework) => {
    if (memoryCache[exampleKey]) return memoryCache[exampleKey];

    const files = await getSourceFilesForPath(
        folderPath,
        framework === EPageFramework.React ? "index.tsx" : "drawExample.js",
        ""
    );
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
            const folderPath = path.join(basePath, currentExample.filepath);
            let baseUrl = req.protocol + "://" + req.get("host");
            const result = await readSourceFiles(framework, folderPath, baseUrl);
            res.send(result);
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

/*
const getParams = (config: SandboxConfig, framework: EPageFramework) => {
    const files = config.files;
    const openInDevBox = framework === EPageFramework.Angular;
    const template = getCodeSandboxTemplate(framework);
    const parameters = getParameters({ files, template })
    return parameters;
}
*/

const CODESANDBOX_URL = "https://codesandbox.io/api/v1/sandboxes/define?json=1";
const sendCodeSandboxRequest = async (body: string) => {
    const response = await fetch(CODESANDBOX_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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
    console.log(sandboxResponse);
    const sandboxId = sandboxResponse.sandbox_id; // Extract the sandbox ID
    return sandboxId;
};

/*
fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  body: JSON.stringify({
    files: {
      "package.json": {
        content: {
          dependencies: {
            react: "latest",
            "react-dom": "latest"
          }
        }
      },
      "index.js": {
        content: code
      },
      "index.html": {
        content: html
      }
    }
  })
})
*/

export const validateStackblitzProject = async (projectId: string, cookies: string[]): Promise<boolean> => {
    const cookieHeader = cookies.join("; ");

    return new Promise((resolve, reject) => {
        const options = {
            hostname: "stackblitz.com",
            path: `/edit/${projectId}`,
            method: "GET",
            headers: {
                Cookie: cookieHeader,
            },
        };

        const req = https.request(options, (res) => {
            // Project accessible if we get a 200 OK response
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                console.error(`Error: Received status code ${res.statusCode}`);
                resolve(false);
            }
        });

        req.on("error", (err) => {
            console.error("Request error:", err);
            reject(err);
        });

        req.end();
    });
};

const simpleTest = {
    project: {
        files: {
            "index.ts": "console.log('Hello, StackBlitz!');",
            "package.json": {
                name: "stackblitz-test",
                version: "1.0.0",
                description: "A simple test project for StackBlitz",
                main: "index.js",
                dependencies: {
                    typescript: "^4.8.0",
                },
                scripts: {
                    start: "tsc index.ts && node index.js",
                },
            },
        },
        template: "node",
        description: "Test project for StackBlitz",
        settings: {
            compile: {
                clearConsole: false,
                action: "refresh",
                trigger: "save",
            },
        },
    },
};

const getTestFormData = () => {
    const formData = new URLSearchParams();
    formData.append("project[files][index.ts]", simpleTest.project.files["index.ts"]);
    formData.append("project[files][package.json]", JSON.stringify(simpleTest.project.files["package.json"]));
    formData.append("project[template]", simpleTest.project.template);
    formData.append("project[description]", simpleTest.project.description);
    formData.append("project[settings]", JSON.stringify(simpleTest.project.settings));

    const formBody = formData.toString();
    return formBody;
};

export const postToStackblitzAndCaptureRedirect = async (
    config: SandboxConfig,
    framework: EPageFramework
): Promise<string | null> => {
    return null;
    /*
    const { "package.json": packageJsonFile, ...restFiles } = config.files;

    const packageJsonContent = replaceAll(JSON.stringify(packageJsonFile.content, null, 2), '"', `&quot;`);
    // @ts-ignore
    const allDependencies = { ...packageJsonFile.content.dependencies, ...packageJsonFile.content.devDependencies };
    const dependenciesArgs = replaceAll(JSON.stringify(allDependencies, null, 2), '"', `&quot;`);

    const filesArgs = Object.entries(restFiles).reduce((acc, [filename, file]) => {
        acc[`project[files][${filename}]`] = file.content;
        return acc;
    }, {} as Record<string, string>);


    const templateArg = getStackblitzTemplate(framework);

    // Form data
    const formData = {
        "project[description]": "SciChart exported example",
        "project[files][package.json]": packageJsonContent,
        "project[dependencies]": dependenciesArgs,
        "project[template]": templateArg,
        "project[settings]": JSON.stringify({
            compile: { clearConsole: false, action: 'refresh', trigger: 'save' },
        }),
        ...filesArgs,
    };
    */

    const formBody = getTestFormData();
    //const formBody = new URLSearchParams(formData).toString();

    // Perform POST request
    /*
    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                hostname: "stackblitz.com",
                port: 443,
                path: "/run",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(formBody),
                },
            },
            (res) => {
                let responseBody = "";

                res.on("data", (chunk) => {
                    responseBody += chunk;
                });

                res.on("end", async () => {
                    if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        resolve(res.headers.location); // Redirect URL captured
                    } else {
                        const root = parse(responseBody);

                        // Example: Extract the <title> or <meta> tags
                        const title = root.querySelector("title")?.text || "Unknown Title";
                        const id = title.split(" ")[0].trim();
                        const cookies = res.headers["set-cookie"];
                        const isValid = await validateStackblitzProject(id, cookies);
                        console.log(isValid);
                        console.log("Page Title:", title);

                        // Infer project URL (e.g., based on known structure)
                        const projectUrl = root.querySelector('meta[property="og:url"]')?.getAttribute("content");
                        console.log("Project URL:", projectUrl || "Could not find URL");

                        console.log("Response Status Code:", res.statusCode);
                        console.log("Response Headers:", res.headers);
                        console.log("Response Body:", responseBody);
                        resolve(null); // No redirect
                    }
                });
            }
        );

        req.on("error", (err) => {
            reject(err);
        });

        req.write(formBody);
        req.end();
    });
    */
};

// Endpoint handler that returns the CodeSandbox URL instead of redirecting
export const getSandboxUrlEndpoint = async (req: Request, res: Response) => {
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
            let platform = req.query.platform as EPlatform;
            const isValidPlatform = Object.values(EPlatform).includes(platform);
            if (!isValidPlatform) {
                platform = EPlatform.CodeSandbox;
            }
            //
            let baseUrl = req.protocol + "://" + req.get("host");
            const folderPath = path.join(basePath, currentExample.filepath);
            const { files, actualFramework } = await getSandboxConfig(folderPath, currentExample, framework, baseUrl);

            if (platform === EPlatform.CodeSandbox) {
                const parms = JSON.stringify({ files });
                const sbres = await sendCodeSandboxRequest(parms); // may fail
                const id = await getId(sbres);
                res.status(200).json({ id, actualFramework });
            } else {
                // stackblitz
                //  const data = getStackblitzData(sandboxConfig, framework)
                //console.log(data);
                const url = await postToStackblitzAndCaptureRedirect({ files }, actualFramework);
                console.log(url);
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

/*
// Endpoint handler that returns the CodeSandbox URL instead of redirecting
export const getCodeSandboxUrlEndpoint = async (req: Request, res: Response) => {
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
            const sandboxConfig = await getSandboxConfig(folderPath, currentExample, framework, baseUrl);

            const platform = req.query.platform;
            //const parms = getParams(sandboxConfig, framework)
            const parms = JSON.stringify(sandboxConfig);

            if (platform === EPlatform.CodeSandbox) {
                const sbres = await sendCodeSandboxRequest(parms); // may fail
                const id = await getId(sbres);
                res.status(200).json({ id });
            } else {  // stackblitz
                const url = getStackblitzUrl(sandboxConfig, framework);
                console.log(url);
                res.status(200).json({ url })
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
*/

// Endpoint handler that returns the Stackblitz URL instead of redirecting
/*
export const getStackblitzUrlEndpoint = async (req: Request, res: Response) => {
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
            const sandboxConfig = await getSandboxConfig(folderPath, currentExample, framework, baseUrl);
            const url = getStackblitzUrl(sandboxConfig, framework);
            res.json({ url });
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
*/

export const renderSandBoxRedirect = async (
    req: Request,
    res: Response,
    sandboxEnv: "codesandbox" | "stackblitz"
): Promise<boolean> => {
    try {
        await loadStyles(basePath);
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
                    ? renderCodeSandBoxRedirectPage(sandboxConfig, framework)
                    : renderStackblitzRedirectPage(sandboxConfig, framework);
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

const handleInvalidFrameworkValue = (value: never): never => {
    throw new Error("Invalid framework value!");
};

const getStackblitzTemplate = (framework: EPageFramework) => {
    switch (framework) {
        case EPageFramework.Angular:
            return "node";
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
        case EPageFramework.React:
            return "create-react-app";
        case EPageFramework.Vanilla:
            return "parcel";
        default:
            return handleInvalidFrameworkValue(framework);
    }
};

export const readSourceFiles = async (framework: EPageFramework, folderPath: string, baseUrl: string) => {
    let files: IFiles = {};
    let actualFramework = framework;

    try {
        switch (framework) {
            case EPageFramework.Angular:
                files = await getSourceFilesForPath(folderPath, "angular.ts", baseUrl);
                break;
            case EPageFramework.React:
                files = await getSourceFilesForPath(folderPath, "index.tsx", baseUrl);
                break;
            case EPageFramework.Vanilla:
                files = await getSourceFilesForPath(folderPath, "vanilla.ts", baseUrl);
                const htmlPath = path.join(folderPath, "index.html");
                let html: string;
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
    } catch (err) {
        // If files not found for requested framework, fallback to React
        if (framework !== EPageFramework.React) {
            actualFramework = EPageFramework.React;
            files = await getSourceFilesForPath(folderPath, "index.tsx", baseUrl);
        } else {
            throw err;
        }
    }

    const result: ExampleSourceFile[] = [];
    for (const key in files) {
        const sep = key.indexOf("/") > 0 ? "/" : "\\";
        const name = key.substring(key.lastIndexOf(sep) + 1);
        result.push({ name, content: files[key].content });
    }
    return { files: result, framework: actualFramework };
};

type ExampleSourceFilesPerFramework = { [value in EPageFramework]: SourceFilesVariant };
const sourceFilesCache = new Map<string, ExampleSourceFilesPerFramework>(
    Object.keys(EXAMPLES_PAGES).map((exampleKey) => [exampleKey, {} as ExampleSourceFilesPerFramework])
);

// Get and cache source files for an example
const cacheSourceFilesVariant = async (exampleKey: string, folderPath: string, framework: EPageFramework) => {
    const result: SourceFilesVariant = await readSourceFiles(framework, folderPath, "");
    sourceFilesCache.get(exampleKey)[framework] = result;
    // if (result.framework !== framework) {
    //     console.warn(`Missing ${framework} variant for ${exampleKey}!`)
    // }

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

export const getCachedSourceFiles = (exampleKey: string, framework: EPageFramework) =>
    sourceFilesCache.get(exampleKey)[framework];
