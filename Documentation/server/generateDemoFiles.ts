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
}

const makeNav = (entry: Entry, categoryName: string) => {
    if (entry.isDemo) {
        makeDemoFiles(entry);
    }
    const category = categoryName ? `data-category=${categoryName}` : "";
    let html = `<li ${category}><a href="${entry.url}">${entry.name}</a>
`;
    if (!entry.isDemo && entry.entries.length > 0) {
        html += `<ul class="list">
`;
        for (const folder of entry.entries) {
            html += makeNav(folder, entry.name);
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
    //console.log(JSON.stringify(entry, undefined, 2));
    let html = `<style>
        body {
            font-family: Arial, sans-serif;
        }
        #searchContainer {
            position: relative;
            width: 300px;
            margin-bottom: 20px;
        }
        #searchBox {
            padding: 10px;
            width: 100%;
            font-size: 16px;
        }
        #clearButton {
            position: absolute;
            right: 10px;
            top: 10px;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            padding: 4px 8px;
        }
        li.hidden {
            display: none;
        }
        .highlight {
            background-color: yellow;
        }
    </style>
    <div id="searchContainer">
        <input type="text" id="searchBox" placeholder="Search...">
        <button id="clearButton">&times;</button>
    </div>
    <script>
        document.getElementById('searchBox').addEventListener('keyup', filterList);
        document.getElementById('clearButton').addEventListener('click', clearSearch);

        function clearSearch() {
            document.getElementById('searchBox').value = '';
            let items = document.querySelectorAll('#list li');
            items.forEach(function(item) {
                item.classList.remove('hidden');                                
            });
            items.forEach(function(item) {                
                // Clear previous highlights
                item.innerHTML = item.innerHTML.replace(/<span class="highlight">(.*?)<\\/span>/g, '$1');                
            });
            console.log("Cleared search from " + items.length + " items");
        }
        
        function filterList() {
            let filter = document.getElementById('searchBox').value.toLowerCase();
            let items = document.querySelectorAll('#list li');
            console.log("Filtering, items ", items.length);

            if (filter === '') {
                clearSearch();
                return;
            }
            items.forEach(function(item) {
                let text = item.textContent.toLowerCase();
                let category = item.getAttribute('data-category')?.toLowerCase() ?? "";

                if ((text.includes(filter) || category.includes(filter))) {
                    item.classList.remove('hidden');
                    console.log("Cleared search from " + item);
                    // Highlight search text
                    const link = item.querySelector('a');
                    const linkText = link.innerText;
                    let index = linkText.toLowerCase().lastIndexOf(filter);
                    if (index !== -1) {
                        let match = linkText.substring(index, index + filter.length);                      
                        // Add highlights
                        link.innerHTML = linkText.replace(match, \`<span class="highlight">\` + match + \`</span>\`);
                    }
                } else {
                    if (item.classList.contains('hidden') === false) {
                        item.classList.add('hidden');
                        // Clear previous highlights
                        item.innerHTML = item.innerHTML.replace(/<span class="highlight">(.*?)<\\/span>/g, '$1');
                    } else {
                        console.log("Already hidden: " + item);
                    }
                }
            });
        }
    </script>
`;
    html += `<ul id="list">
`;
    for (const folder of entry.entries) {
        html += makeNav(folder, undefined);
    }
    html += `</ul>
`;
    console.log("Updating nav html");
    fs.promises.writeFile("server/nav.html", html);
})
