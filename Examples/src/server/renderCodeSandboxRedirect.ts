import * as path from "path";
import * as fs from "fs";
import { Request, Response } from "express";
import { getParameters } from "codesandbox/lib/api/define";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";

const getCodeSandBoxForm = (demoHtml: string, css: string, code: string, title: string) => {
      code = code.replace('from "scichart";', `from "scichart";
  // When importing scichart from npm, the default is to get the wasm from local files, but that is awkward with parcel in codeSandbox,     
  SciChartSurface.useWasmFromCDN();`);
    code = code.replace('if (location.search.includes("builder=1"))', '// Uncomment this to use the builder example');
    code = code.replace('builderExample("scichart-root");', '//builderExample("scichart-root");');
    const parameters = getParameters({
      files: {
        "package.json": {
          // @ts-ignore
          content: {
              "name": title,
              "version": "1.0.0",
              "main": "index.html",
              "scripts": {
                "start": "parcel index.html --open",
                "build": "parcel build index.html"
              },
              "dependencies": {
                "parcel-bundler": "^1.6.1",
                "scichart": "3.0.301"
              },
              "devDependencies": {
                "@babel/core": "7.2.0",
                "typescript": "4.4.4"
              },
              "resolutions": {
                "@babel/preset-env": "7.13.8"
              }
          }
        },
        "src/index.ts": {
          content: code,
          isBinary: false
        },
        "index.html": {
          content:  `<html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>${title}</title>
        <script async type="text/javascript" src="src/index.ts" defer></script>
        <style>
          ${css}
        </style>
    </head>
    <body>
      ${demoHtml}  
    </body>
  </html>
          `,
          isBinary: false
        },
        "tsconfig.json": {
          content: `{
    "compilerOptions": {
      "strict": true,
      "module": "commonjs",
      "jsx": "preserve",
      "esModuleInterop": true,
      "sourceMap": true,
      "allowJs": true,
      "lib": [
        "es6",
        "dom"
      ],
      "rootDir": "src",
      "moduleResolution": "node"
    }
  }`,
        isBinary: false
        }
      }
    });
    return `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
    <input type="hidden" name="parameters" value="${parameters}" />
  </form>`
  }
  
  const renderCodeSandBoxRedirectPage = (demoHtml: string, css: string, code: string, title: string) => {
    const form = getCodeSandBoxForm(demoHtml, css, code, title);
    return `
    <html lang="en-us">
      <head>
          <meta charset="utf-8" />
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
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
  }

export const renderCodeSandBoxRedirect = async (req: Request, res: Response) => {
    let basePath = path.join(__dirname, "../Examples", req.path);
    // For charts without layout we use '/iframe' prefix, for example '/iframe/javascript-multiline-labels'
    const isIFrame = req.url.substring(1, 7) === 'iframe';
    const pathname = isIFrame ? req.url.substring(7) : req.url;
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find(key => EXAMPLES_PAGES[key].path === pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    try {
      const tsPath = path.join(basePath, pathname, "index.tsx");
      const title = "SciChart.js Example";
      const demojs = await fs.promises.readFile(tsPath, "utf8");
      //res.send(renderCodeSandBoxRedirect(demoHtml, demoCss, demojs, currentExample.title));
      return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
}