import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { getParameters } from "codesandbox/lib/api/define";
import {encode} from 'html-entities';

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";

app.use(express.static("src"));
app.use(express.static("static"));

const navHtml = fs.readFileSync("server/nav.html", "utf8");

const snippets = new Map<string,string>();

app.get("*", async (req: Request, res: Response) => {
    let basePath = path.join(__dirname, "../src", req.path);
    if (req.path.endsWith("html")) {
      res.sendStatus(404);
    }
    try {
      const htmlPath = path.join(basePath, "demo.html");
      const tsPath = path.join(basePath, "demo.ts");
      const jsPath = path.join(basePath, "demo.js")
      let isTs = true;
      let demoHtml = snippets.get(htmlPath);
      let demojs = snippets.get(tsPath);
      const title = "SciChart.js documentation snippet for " + req.path.split("/").filter(v => v.length > 0).join(" - ");
      if (!demoHtml) {
        demoHtml = await fs.promises.readFile(htmlPath, "utf8");
        snippets.set(htmlPath, demoHtml);
      }
      if (!demojs) {
        demojs = snippets.get(jsPath);
        if (!demojs) {
          try {
            await fs.promises.access(tsPath);
            demojs = await fs.promises.readFile(tsPath, "utf8");
            snippets.set(tsPath, demojs);
            isTs = true;
          } catch (err) {
            demojs = await fs.promises.readFile(jsPath, "utf8");
            snippets.set(jsPath, demojs);
            isTs = false;
          }
        } else {
          isTs = false;
        }
      }
      const cssPath = path.join(basePath, "demo.css");
      let demoCss = snippets.get(cssPath);
      if (!demoCss) {
        demoCss = await fs.promises.readFile(cssPath, "utf8");
        snippets.set(cssPath, demoCss);
      }
      if (req.query["codepen"]) {
        const json = await makePen(demoHtml, demojs, demoCss, isTs, title);
        res.send(renderCodePenRedirect(json));
        return;
      }
      if (req.query["codesandbox"]) {
        res.send(renderCodeSandBoxRedirect(demoHtml, demoCss, demojs, isTs, title));
        return;
      }
      res.send(renderIndexHtml(demoHtml, demoCss, req.originalUrl, demojs, !req.query["nav"], !!req.query["embed"], isTs, title));
    } catch (err) {
      console.log(err);
      res.send(renderIndexHtml(`<div>No index.html or demo.html found</div>`, undefined, undefined, undefined, true, false, false, "SciChart.js doc snippets"));
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

const renderIndexHtml = (html: string, css: string, url: string, code: string, showNav: boolean, embed: boolean, isTS: boolean, title: string) => {
  let body = "";
  let scripts = "";
  const queryChar = url && url.includes("?") ? (url.endsWith("?") ? "" : "&") : "?";
  if (showNav) {
    const codePenLink = `<a href="http://${host}:${port}${url + queryChar}codepen=1" target="_blank">Edit in CodePen</a></br>`;
    const codeSandboxLink = `<a href="http://${host}:${port}${url + queryChar}codesandbox=1" target="_blank">Edit in CodeSandbox</a></br>`;
    const embedLink = embed ? `<a href="${url.replace("embed=1", "")}">Show Result</a></br>`
     : `<a href="${url + queryChar}embed=1">Show as Embed</a></br>`;
    const links = url ? `<div>
    <a href="https://jsfiddle.net/gh/get/library/pure/ABTSoftware/SciChart.JS.Examples/tree/master/Documentation/src${url}" target="_blank">Edit in jsFiddle</a></br>
    ${codePenLink}
    ${embedLink}
    ${codeSandboxLink}
    <a href="${url + queryChar}nav=0">View full screen</a></br>
    </div>` : "";
    const iframe = url === undefined ? "<p>Please select an example</p>" :
        `<iframe style="width: 800px; height: 600px;" src="${url + queryChar}nav=0"></iframe>`;
    body = `
    <div style="display: flex">
      <div style="flex-basis: 100px; border: 1;">
        ${navHtml}
      </div>
      <div>      
        ${iframe}        
        ${links}
      </div>
    </div>`;
  } else if (embed) {
    body = `<div style="width: 100%; height: 100vh;">${renderCodePenEmbed(html, code, css, isTS, title)}</div>`;
  } else {
    scripts = `<script type="text/javascript" src="/scichart.browser.js"></script>
<script type="text/javascript" src="/common.js"></script>
<script async type="text/javascript" src="demo.js"></script>`;
    body = `<div style="width: 100%; height: 100vh;">${html}</div>`;
  }
  return `
  <html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta name='robots' content='noindex,follow' />
        <title>${title}</title>
        ${scripts}
        <style>
            iframe { border: 0; }
            ${css}
        </style>
    </head>
    <body>
      ${body}
    </body>
</html>
`
}

const getCodeSandBoxForm = (demoHtml: string, css: string, code: string, isTS: boolean, title: string) => {
  if (!isTS) {
    code = `
// We are using npm in CodeSandbox, so we need this import.
import * as SciChart from "scichart";
// When importing scichart from npm, the default is to get the wasm from local files, but that is awkward with parcel in codeSandbox, 
SciChart.SciChartSurface.useWasmFromCDN();
` + code
  } else {
    code = code.replace('from "scichart";', `from "scichart";
// When importing scichart from npm, the default is to get the wasm from local files, but that is awkward with parcel in codeSandbox,     
SciChartSurface.useWasmFromCDN();`);
  }
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

const renderCodeSandBoxRedirect = (demoHtml: string, css: string, code: string, isTS: boolean, title: string) => {
  const form = getCodeSandBoxForm(demoHtml, css, code, isTS, title);
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

const makePen = async (html: string, js: string, css: string, isTS: boolean, title: string) => {
  js = fixCodepenJS(js, isTS);
  const json = {
    title,
    description: "A documentation snippet for SciChart.js from scichart.com/javascript-chart-documentation.  Find out more about SciChart at scichart.com/javascript-chart-features",
    html,
    js,
    css,
    tags: ["scichart", "documentation"],
    layout: "left",
    editors: "001",
    js_pre_processor: isTS ? "typescript" : "none",
    js_external: "https://cdn.jsdelivr.net/npm/scichart/index.min.js"
  }
  return json;
}

const renderCodePenRedirect = (json: any) => {
  const JSONstring = JSON.stringify(json)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/\s\s\s\s/g, '  ');
  return `
  <html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>SciChart.js Documentation Examples</title>
    </head>
    <body>
      <p>Redirecting To codepen...</p>
      <form name="codepen" id="codepen" action="https://codepen.io/pen/define" method="POST">
        <input type="hidden" name="data" value=\'${JSONstring}'\'>
      </form>
      <script type="text/javascript">
        document.querySelector("#codepen").submit();
      </script>
    </body>
</html>`
}

const fixCodepenJS = (js: string, isTS: boolean,) => {
  if (isTS) {
    js = js.replace("import", "const");
    js = js.replace('from "scichart";', "= SciChart;");
  }
  js = js.replace('if (location.search.includes("builder=1"))', '// Uncomment this to use the builder example');
  js = js.replace('builderExample("scichart-root");', '//builderExample("scichart-root");');
  return js;
}

const renderCodePenEmbed = (html: string, js: string, css: string, isTS: boolean, title: string) => {
  js = fixCodepenJS(js, isTS);
  return `<div 
  class="codepen" 
  data-prefill='{
    "title": "${title}",
    "description": "A documentation snippet for SciChart.JS from scichart.com/javascript-chart-documentation.  Find out more about SciChart at scichart.com/javascript-chart-features",
    "tags": ["scichart", "documentation"],
    "head": "&lt;meta name=&#x27;viewport&#x27; content=&#x27;width=device-width, initial-scale=1&#x27;&gt;",
    "scripts": ["https://cdn.jsdelivr.net/npm/scichart/index.min.js"]
  }'
  style="height: 100%; overflow: auto;"
  data-height=100%
  data-theme-id="44333"
  data-default-tab="result" 
  data-editable="true"
>
  <pre data-lang="html">
${encode(html)}
  </pre>
  <pre data-lang="css">
${encode(css)}
  </pre>
  <pre data-lang="${isTS ? "typescript" : "js"}">
${encode(js)}
  </pre>
</div>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
`;
}