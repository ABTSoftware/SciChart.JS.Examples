import * as express from "express";
import { Request, Response } from "express";
import * as path from "path";
import * as fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("src"));
app.use(express.static("static"));

app.get("*", async (req: Request, res: Response) => {
    let demoPath = path.join(__dirname, "../src", req.path);
    if (!req.path.endsWith("html")) {
      demoPath = path.join(demoPath, "demo.html")
    }
    try {
      const demoHtml = await fs.promises.readFile(demoPath, "utf8");
      res.send(renderIndexHtml(demoHtml));
    } catch (err) {
      console.log(err);
      res.send(renderIndexHtml(`<div>No index.html or demo.html found</div>`));
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


const renderIndexHtml = (html: string) => {
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
        ${html}
    </body>
</html>
  `
}