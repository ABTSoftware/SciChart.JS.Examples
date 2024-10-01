import * as path from "path";
import * as fs from "fs";
import { Request, Response } from "express";
import { EXAMPLES_PAGES, TExamplePage } from "../components/AppRouter/examplePages";
import { IFiles, loadStyles } from "./sandboxDependencyUtils";
import { getSandboxWithTemplate, getSourceFilesForPath, indexHtmlTemplate } from "./sandboxForms";
import { BadRequestError, IHttpError, NotFoundError } from "./Errors";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
import { SettingsRemote } from "@material-ui/icons";
import { stringOccurrences } from "scichart";

const renderCodeSandBoxRedirectPage = (form: string) => {
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

export const getRequestedExample = (req: Request, res: Response) => {
    const examplePath = req.params.example;
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === examplePath);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];

    if (!currentExample) {
        throw new NotFoundError(`Example ${examplePath} doesn't exist!`);
    }

    return currentExample;
};

export const getSourceFiles = async (req: Request, res: Response) => {
    try {
        let currentExample: TExamplePage;
        try {
            currentExample = getRequestedExample(req, res);
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
            console.log("Get source files for ", currentExample.title, framework);
            const folderPath = path.join(basePath, currentExample.filepath);
            let files: IFiles = {};
            let htmlPath: string;
            let html: string;
            let baseUrl = req.protocol + "://" + req.get("host");
            switch (framework) {
                case EPageFramework.Angular:
                    files = await getSourceFilesForPath(folderPath, "angular.ts", baseUrl);
                    htmlPath = path.join(folderPath, "angular.html");
                    try {
                        html = await fs.promises.readFile(htmlPath, "utf8");
                    } catch (err) {
                        html = `<scichart-angular [initChart]="drawExample"></scichart-angular>`;
                    }
                    files[htmlPath] = { content: html, isBinary: false };
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
                console.log(key);
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

export const renderCodeSandBoxRedirect = async (req: Request, res: Response) => {
    try {
        await loadStyles(basePath);
        let currentExample: TExamplePage;
        try {
            currentExample = getRequestedExample(req, res);
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
            const form = await getSandboxWithTemplate(
                folderPath,
                currentExample,
                req.query.framework as EPageFramework,
                baseUrl
            );
            const page = renderCodeSandBoxRedirectPage(form);
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
