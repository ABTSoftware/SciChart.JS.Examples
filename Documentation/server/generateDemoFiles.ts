import * as path from "path";
import * as fs from "fs";

const baseDir = path.join(__dirname, "../src");

class Entry { 
    name: string;
    url: string;
    entries: Entry[] = [];
    isDemo: boolean = false;
    hasDetails: boolean = false;
    hasHtml: boolean = false;
    hasCss: boolean = false;
    isTS: boolean = false;
    constructor(path: string) {
        this.url = path.substring(baseDir.length).replaceAll("\\", "/");
        this.name = path.substring(path.lastIndexOf("\\") + 1);
        
    }
}

var walk = function(dir: string, done: (err: any, entry?: Entry)=> void) {
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      const entry: Entry = new Entry(dir);
      if (!pending) return done(null, entry);    
      list.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => {
          if (stat && stat.isDirectory()) {
            walk(file, (err, res) => {
                if (res) {
                    entry.entries.push(res);
                }
              if (!--pending) done(null, entry);
            });
          } else {
            const fileName = path.basename(file);
            if (fileName === "demo.js") {
                entry.isDemo = true;
            } else if (fileName === "demo.html") {
                entry.hasHtml = true;
            } else if (fileName === "demo.css") {
                entry.hasCss = true;
            } else if (fileName === "demo.details") {
                entry.hasDetails = true;
            } else if (fileName === "demo.ts") {
                entry.isTS = true;
            }
            if (!--pending) done(null, entry);
          }
        });
      });
    });
  };

const makeDemoFiles = (entry: Entry) => {
    if (!entry.isDemo) return;
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
        fs.promises.writeFile(detailsPath, `---
name: SciChart.js ${entry.url} Documentation
description: A Documentation for SciChart.js
authors:
    - SciChart Ltd
resources:
    - https://cdn.jsdelivr.net/npm/scichart/index.min.js
normalize_css: no
panel_js: 0
panel_html: 0
panel_css: 0`);
    }
}

const makeNav = (entry: Entry) => {
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
}

walk(baseDir, (err, entry) => {
    if (!entry) return;
    console.log(JSON.stringify(entry, undefined, 2));
    let html = `<ul>
`;
    for (const folder of entry.entries) {
        html += makeNav(folder);
    }
    html += `</ul>
`;
    console.log("Updating nav html");
    fs.promises.writeFile("server/nav.html", html);
})
