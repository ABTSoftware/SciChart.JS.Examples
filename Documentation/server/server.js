"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const fs = require("fs");
const define_1 = require("codesandbox/lib/api/define");
const html_entities_1 = require("html-entities");
const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";
app.use(express.static("src"));
app.use(express.static("static"));
const navHtml = fs.readFileSync("server/nav.html", "utf8");
const snippets = new Map();
const makePen = async (html, js, css) => {
    const json = {
        title: "SciChart.js Documentation Snippet",
        html,
        js,
        css,
        layout: "left",
        editors: "001",
        js_external: "https://cdn.jsdelivr.net/npm/scichart/index.min.js"
    };
    return json;
};
app.get("*", async (req, res) => {
    let basePath = path.join(__dirname, "../src", req.path);
    if (req.path.endsWith("html")) {
        res.sendStatus(404);
    }
    try {
        const htmlPath = path.join(basePath, "demo.html");
        const jsPath = path.join(basePath, "demo.js");
        let demoHtml = snippets.get(htmlPath);
        let demojs = snippets.get(jsPath);
        if (!demoHtml) {
            demoHtml = await fs.promises.readFile(htmlPath, "utf8");
            snippets.set(htmlPath, demoHtml);
        }
        if (!demojs) {
            demojs = await fs.promises.readFile(jsPath, "utf8");
            snippets.set(jsPath, demojs);
        }
        const cssPath = path.join(basePath, "demo.css");
        let demoCss = snippets.get(cssPath);
        if (!demoCss) {
            demoCss = await fs.promises.readFile(cssPath, "utf8");
            snippets.set(cssPath, demoCss);
        }
        if (req.query["codepen"]) {
            const json = await makePen(demoHtml, demojs, demoCss);
            res.send(renderCodePenRedirect(json));
            return;
        }
        res.send(renderIndexHtml(demoHtml, demoCss, req.originalUrl, demojs, !req.query["nav"], !!req.query["embed"], parseInt(req.query["height"].toString())));
    }
    catch (err) {
        console.log(err);
        res.send(renderIndexHtml(`<div>No index.html or demo.html found</div>`, undefined, undefined, undefined, true, false));
    }
});
app.listen(port, () => {
    console.log(`Example app listening at http://${host}:${port}`);
});
const renderIndexHtml = (html, css, url, code, showNav, embed, embedHeight = 400) => {
    let body = "";
    let scripts = "";
    const queryChar = url.includes("?") ? "&" : "?";
    if (showNav) {
        const codePenLink = `http://${host}:${port}${url}?codepen=1`;
        const embedLink = embed ? `<a href="${url.replace("embed=1", "")}">Show Result</a></br>`
            : `<a href="${url + queryChar}embed=1">Show as Embed</a></br>`;
        const links = url ? `<div>
    <a href="https://jsfiddle.net/gh/get/library/pure/ABTSoftware/SciChart.JS.Examples/tree/master/Documentation/src${url}" target="_blank">Edit in jsFiddle</a></br>
    <a href="${codePenLink}" target="_blank">Edit in CodePen</a></br>
    ${embedLink}
    <a href="${url + queryChar}nav=0">View full screen</a></br>
    ${getCodeSandBoxForm(html, code)}
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
    }
    else if (embed) {
        body = `<div style="width: 100%; height: 100vh;">${renderCodePenEmbed(html, code, css, embedHeight)}</div>`;
    }
    else {
        scripts = `<script type="text/javascript" src="/scichart.browser.js"></script>
<script type="text/javascript" src="/common.js"></script>
<script async type="text/javascript" src="demo.js" defer></script>`;
        body = `<div style="width: 100%; height: 100vh;">${html}</div>`;
    }
    return `
  <html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>SciChart.js Documentation Examples</title>
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
`;
};
const getCodeSandBoxForm = (demoHtml, code) => {
    const parameters = (0, define_1.getParameters)({
        files: {
            "package.json": {
                // @ts-ignore
                content: {
                    "name": "SciChart.JS Documentation Snippet",
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
                content: `
// We are using npm in CodeSandbox, so we need this import.
import * as SciChart from "scichart";
// When importing scichart from npm, the default is to get the wasm from local files, but that is awkward with parcel in codeSandbox, 
SciChart.SciChartSurface.useWasmFromCDN()
` + code,
                isBinary: false
            },
            "index.html": {
                content: `<html lang="en-us">
  <head>
      <meta charset="utf-8" />
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>SciChart.js Documentation Example</title>
      <script async type="text/javascript" src="src/index.ts" defer></script>
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
    return `<form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
  <input type="hidden" name="parameters" value="${parameters}" />
  <input type="submit" value="Open in sandbox" />
</form>`;
};
const renderCodePenRedirect = (json) => {
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
</html>`;
};
const renderCodePenEmbed = (html, js, css, height = 400) => {
    return `<div 
  class="codepen" 
  data-prefill='{
    "title": "SciChart Documentation Example",
    "tags": ["scichart"],
    "head": "&lt;meta name=&#x27;viewport&#x27; content=&#x27;width=device-width, initial-scale=1&#x27;&gt;",
    "scripts": ["https://cdn.jsdelivr.net/npm/scichart/index.min.js"]
  }'
  style="height: 100%; overflow: auto;"
  data-height=${height}
  data-theme-id="light"
  data-default-tab="js,result" 
  data-editable="true"     
>
  <pre data-lang="html">
${(0, html_entities_1.encode)(html)}
  </pre>
  <pre data-lang="css">
${(0, html_entities_1.encode)(css)}
  </pre>
  <pre data-lang="js">
${(0, html_entities_1.encode)(js)}
  </pre>
</div>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
`;
};
