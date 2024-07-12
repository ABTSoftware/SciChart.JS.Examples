import * as path from "path";
import { Request, Response } from "express";
import { EXAMPLES_PAGES, TExamplePage } from "../components/AppRouter/examplePages";
import { loadStyles } from "./sandboxDependencyUtils";
import { getSandboxWithTemplate } from "./sandboxForms";
import { BadRequestError, IHttpError, NotFoundError } from "./Errors";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";

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
            const folderPath = path.join(basePath, currentExample.filepath);
            const form = await getSandboxWithTemplate(
                folderPath,
                currentExample,
                req.query.framework as EPageFramework
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
