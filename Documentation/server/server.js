"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var port = 3000;
app.use(express.static("src"));
app.use(express.static("static"));
app.get("*/index.html", function (req, res) {
    console.log(__dirname, req.url);
    // const directoryPath = path.join(__dirname, req.query.);
    // const files = fs.readdirSync(directoryPath);
    res.send(renderIndexHtml(""));
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
var renderIndexHtml = function (html) {
    return "\n  <html lang=\"en-us\">\n    <head>\n        <meta charset=\"utf-8\" />\n        <meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\" />\n        <title>SciChart.js Documentation Examples</title>\n        <script type=\"text/javascript\" src=\"/scichart.browser.js\"></script>\n        <script type=\"text/javascript\" src=\"/common.js\"></script>\n\n        <script async type=\"text/javascript\" src=\"demo.js\" defer></script>\n        <style>\n            body { font-family: 'Arial', margin: 0}\n        </style>\n    </head>\n    <body>\n        <div id=\"scichart\" style=\"width: 800px; height: 600px;\"></div>\n        " + html + "\n    </body>\n</html>\n  ";
};
//# sourceMappingURL=server.js.map