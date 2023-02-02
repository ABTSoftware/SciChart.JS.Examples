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
                    if (!--pending)
                        done(null, entry);
                }
            });
        });
    });
};
const makeNav = (entry) => {
    let html = `<li><a href="${entry.url}">${entry.name}</a>
`;
    if (entry.entries.length > 0) {
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
    let html = `<ul>
`;
    for (const folder of entry.entries) {
        html += makeNav(folder);
    }
    html += `</ul>
`;
    console.log(html);
});
