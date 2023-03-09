import * as path from "path";
import * as fs from "fs";
import { Request, Response } from "express";
import { getParameters } from "codesandbox/lib/api/define";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";

interface IFiles {
  [key: string]: {
      content: string;
      isBinary: boolean;
  };
}

const getCodeSandBoxForm = async (folderPath: string, title: string) => {
  const tsPath = path.join(folderPath, "index.tsx");
  const code = await fs.promises.readFile(tsPath, "utf8");
  const localImports = Array.from(code.matchAll(/import.*from "\.\/(.*)";/g));

  const files: IFiles = {
    "package.json": {
      // @ts-ignore
      content: {
          "name": title,
          "version": "1.0.0",
          "main": "src/index.tsx",
          "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test --env=jsdom",
            "eject": "react-scripts eject"
          },
          "dependencies": {
            "@material-ui/core": "4.12.4",
            "@material-ui/lab": "4.0.0-alpha.61",
            "react": "18.0.0",
            "react-dom": "18.0.0",
            "react-scripts": "4.0.3",
            "scichart": "^3.0.301",
            "scichart-example-dependencies": "^0.1.2"
          },
          "devDependencies": {
            "@types/react": "18.0.25",
            "@types/react-dom": "18.0.9",
            "typescript": "4.4.2"
          },
          "browserslist": [
            ">0.2%",
            "not dead",
            "not ie <= 11",
            "not op_mini all"
          ]
      }
    },
    "src/App.tsx": {
      content: code,
      isBinary: false
    },
    "src/index.tsx": {
      content:  `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SciChartSurface } from "scichart";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);
SciChartSurface.useWasmFromCDN();
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
      isBinary: false
    },
    "tsconfig.json": {
      content: `{
  "include": [
      "./src/**/*"
  ],
  "compilerOptions": {
      "strict": true,
      "esModuleInterop": true,
      "lib": [
          "dom",
          "es2015"
      ],
      "jsx": "react-jsx"
  }
}`,
      isBinary: false
    }
  };

  for (const localImport of localImports) {
    if (localImport.length > 1) {
      const filepath = path.join(folderPath, localImport[1] + ".ts");
      const csPath = "src/" + localImport[1] + ".ts";
      const content = await fs.promises.readFile(filepath, "utf8");
      files[csPath] = { content, isBinary: false };
    }
  }
  const parameters = getParameters({ files });
    return `<form name="codesandbox" id="codesandbox" action="https://codesandbox.io/api/v1/sandboxes/define" method="POST">
    <input type="hidden" name="parameters" value="${parameters}" />
  </form>`
  }
  
  const renderCodeSandBoxRedirectPage = async (folderPath: string, title: string) => {
    const form = await getCodeSandBoxForm(folderPath, title);
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
    let basePath = path.join(__dirname, "Examples");
    // For charts without layout we use '/iframe' prefix, for example '/iframe/javascript-multiline-labels'
    const isIFrame = req.path.substring(1, 7) === 'iframe';
    const pathname = isIFrame ? req.path.substring(7) : req.path;
    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find(key => EXAMPLES_PAGES[key].path === pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    try {     
      const folderPath = path.join(basePath, currentExample.filepath);
      const page = await renderCodeSandBoxRedirectPage(folderPath, currentExample.title);
      res.send(page);
      return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
}