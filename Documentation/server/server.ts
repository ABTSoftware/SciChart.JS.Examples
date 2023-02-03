import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";
const gitHubBranch = "NewDocumentation";

app.use(express.static("src"));
app.use(express.static("static"));

const navHtml = fs.readFileSync("server/nav.html", "utf8");

const snippets = new Map<string,string>();

const makePen = async (basePath: string, html: string) => {
  const jsPath = path.join(basePath, "demo.js");
  const js = await fs.promises.readFile(jsPath, "utf8");
  const cssPath = path.join(basePath, "demo.css");
  const css = await fs.promises.readFile(cssPath, "utf8");
  const json = {
    title: "SciChart.js Documentation Snippet",
    html,
    js,
    css,
    layout: "left",
    editors: "001",
    js_external: "https://cdn.jsdelivr.net/npm/scichart/index.min.js"
  }
  return json;
}

app.get("*", async (req: Request, res: Response) => {
    let basePath = path.join(__dirname, "../src", req.path);
    if (req.path.endsWith("html")) {
      res.sendStatus(404);
    }
    try {
      const htmlPath = path.join(basePath, "demo.html");
      let demoHtml = snippets.get(htmlPath);
      if (!demoHtml) {
        demoHtml = await fs.promises.readFile(htmlPath, "utf8");
        snippets.set(htmlPath, demoHtml);
      }
      if (req.query["codepen"]) {
        const json = await makePen(basePath, demoHtml);
        res.send(renderCodePenRedirect(json));
        return;
      }

      res.send(renderIndexHtml(demoHtml, !req.query["nav"], req.originalUrl));
    } catch (err) {
      console.log(err);
      res.send(renderIndexHtml(`<div>No index.html or demo.html found</div>`, true, undefined));
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

const renderIndexHtml = (html: string, showNav: boolean, url: string) => {
  const codePenLink = `http://${host}:${port}${url}?codepen=1`;
  const links = url ? `<div>
  <a href="https://jsfiddle.net/gh/get/ABTSoftware/SciChart.JS.Examples/tree/master/Documentation/src${url}" target="_blank">Edit in jsFiddle</a></br>
  <a href="${codePenLink}" target="_blank">Edit in CodePen</a>
  </div>` : "";
  const body = showNav ? `
  <div style="display: flex">
    <div style="flex-basis: 100px; border: 1;">
      ${navHtml}
    </div>
    <div>
      <div style="width: 800px; height: 600px;">
        ${html}
      </div>  
      ${links}
    </div>
  </div>` : 
  `<div style="height: 100vh;">
    <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
      ${html}
    </div>
  </div>`;
  return `
  <html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>SciChart.js Documentation Examples</title>
        <script type="text/javascript" src="/scichart.browser.js"></script>
        <script type="text/javascript" src="/common.js"></script>

        <script async type="text/javascript" src="demo.js" defer></script>
        <style>
            body { font-family: 'Arial'}
        </style>
    </head>
    <body>
      ${body}  
    </body>
</html>
  `
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