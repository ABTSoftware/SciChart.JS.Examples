"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const baseDir = path.join(__dirname, "../src");
class Entry {
    constructor(path) {
        this.entries = [];
        this.isDemo = false;
        this.hasDetails = false;
        this.hasHtml = false;
        this.hasCss = false;
        this.isTS = false;
        this.url = path.substring(baseDir.length).replaceAll("\\", "/");
        this.name = path.substring(path.lastIndexOf("\\") + 1);
    }
}
var walk = function (dir, done) {
    fs.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        var pending = list.length;
        const entry = new Entry(dir);
        if (!pending)
            return done(null, entry);
        list.forEach((file) => {
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(file, (err, res) => {
                        if (res) {
                            entry.entries.push(res);
                        }
                        if (!--pending)
                            done(null, entry);
                    });
                }
                else {
                    const fileName = path.basename(file);
                    if (fileName === "demo.js") {
                        entry.isDemo = true;
                    }
                    else if (fileName === "demo.html") {
                        entry.hasHtml = true;
                    }
                    else if (fileName === "demo.css") {
                        entry.hasCss = true;
                    }
                    else if (fileName === "demo.details") {
                        entry.hasDetails = true;
                    }
                    else if (fileName === "demo.ts") {
                        entry.isTS = true;
                    }
                    if (!--pending)
                        done(null, entry);
                }
            });
        });
    });
};
const makeDemoFiles = (entry) => {
    if (!entry.isDemo)
        return;
    if (entry.isTS) {
        const jsPath = path.join(baseDir, entry.url, "demo.js");
        console.log("Fixing js for ", entry.url);
        fs.promises.readFile(jsPath, "utf8").then(js => {
            js = js.replace('Object.defineProperty(exports, "__esModule", { value: true });', "");
            js = js.replace('const scichart_1 = require("scichart");', "const scichart_1 = SciChart;");
            fs.promises.writeFile(jsPath, js);
        });
    }
    if (!entry.hasHtml) {
        console.log("Writing demo.html for ", entry.url);
        const htmlPath = path.join(baseDir, entry.url, "demo.html");
        fs.promises.writeFile(htmlPath, `<div id="scichart-root" ></div>`);
    }
    if (!entry.hasCss) {
        console.log("Writing demo.css for ", entry.url);
        const cssPath = path.join(baseDir, entry.url, "demo.css");
        fs.promises.writeFile(cssPath, `body { margin: 0; }
#scichart-root { width: 100%; height: 100vh; }`);
    }
    if (!entry.hasDetails) {
        console.log("Writing demo.details for ", entry.url);
        const detailsPath = path.join(baseDir, entry.url, "demo.details");
        const title = "SciChart.js documentation snippet for " + entry.url.split("/").filter(v => v.length > 0).join(" - ");
        fs.promises.writeFile(detailsPath, `---
name: ${title}
description: A documentation snippet for SciChart.JS from scichart.com/javascript-chart-documentation.  Find out more about SciChart at scichart.com/javascript-chart-features
authors:
    - SciChart Ltd
resources:
    - https://cdn.jsdelivr.net/npm/scichart/index.min.js
normalize_css: no
panel_js: 0
panel_html: 0
panel_css: 0`);
    }
};
const makeNav = (entry) => {
    if (entry.isDemo) {
        makeDemoFiles(entry);
    }
    let html = `<li><a href="${entry.url}">${entry.name}</a>
`;
    if (!entry.isDemo && entry.entries.length > 0) {
        html += `<ul>
`;
        for (const folder of entry.entries) {
            html += makeNav(folder);
        }
        html += `</ul>
 `;
    }
    html += `</li>
`;
    return html;
};
walk(baseDir, (err, entry) => {
    if (!entry)
        return;
    //console.log(JSON.stringify(entry, undefined, 2));
    let html = `<ul>
`;
    for (const folder of entry.entries) {
        html += makeNav(folder);
    }
    html += `</ul>
`;
    console.log("Updating nav html");
    fs.promises.writeFile("server/nav.html", html);
});
