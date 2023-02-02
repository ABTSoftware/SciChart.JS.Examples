import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("src"));
app.use(express.static("static"));

const navHtml = fs.readFileSync("server/nav.html", "utf8");

app.get("*", async (req: Request, res: Response) => {
    let basePath = path.join(__dirname, "../src", req.path);
    if (req.path.endsWith("html")) {
      res.sendStatus(404);
    }
    const htmlPath = path.join(basePath, "demo.html");
    try {
      const demoHtml = await fs.promises.readFile(htmlPath, "utf8");
      res.send(renderIndexHtml(demoHtml, !req.query["nav"]));
    } catch (err) {
      console.log(err);
      res.send(renderIndexHtml(`<div>No index.html or demo.html found</div>`, true));
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


const renderIndexHtml = (html: string, showNav: boolean) => {
  const nav = showNav ? `<div style="flex-basis: 100px; border: 1;">
          ${navHtml}
  </div>` : ""; 
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
    <div style="display: flex">
      ${nav}
      <div>
          <div style="width: 800px; height: 600px;">
          ${html}
          </div>  
      </div>
    </div>
   
    </body>
</html>
  `
}