import * as path from "path";
import { Request, Response } from "express";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";
import { loadStyles } from "./sandboxDependencyUtils";
import { getSandboxWithTemplate } from "./sandboxForms";
import { EPageFramework } from "../components/AppRouter/pages";

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

const basePath = path.join(__dirname, "Examples");

export const renderCodeSandBoxRedirect = async (req: Request, res: Response) => {
    try {
        await loadStyles(basePath);
        // For charts without layout we use '/iframe' prefix, for example '/iframe/javascript-multiline-labels'
        const isIFrame = req.path.substring(1, 7) === "iframe";
        const pathname = isIFrame ? req.path.substring(7) : req.path;
        // const segments = pathname.split("/");
        // console.log("segments", segments);
        // const framework = segments[1] as EPageFramework;
        const framework = req.query.framework as EPageFramework;
        const isValidFramework = Object.values(EPageFramework).includes(framework);
        if (!isValidFramework) {
            return res.send(400);
        }
        const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === pathname);
        const currentExample = EXAMPLES_PAGES[currentExampleKey];
        const folderPath = path.join(basePath, currentExample.filepath);

        const form = await getSandboxWithTemplate(folderPath, currentExample, framework);
        const page = renderCodeSandBoxRedirectPage(form);
        res.send(page);
        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
};
