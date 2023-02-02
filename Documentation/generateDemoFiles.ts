import * as path from "path";
import * as fs from "fs";

const baseDir = __dirname + "/src";

class Entry { 
    name: string;
    url: string;
    entries: Entry[] = [];
    isDemo: boolean = false;
    hasDetails: boolean = false;
    hasHtml: boolean = false;
    hasCss: boolean = false;

    constructor(path: string) {
        this.url = path.substring(baseDir.length);
        this.name = path.substring(path.lastIndexOf("\\"));
        
    }
}

var walk = function(dir: string, done: (err: any, entry?: Entry)=> void) {
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      const entry: Entry = new Entry(dir);
      if (!pending) return done(null, entry);    
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
                if (res) {
                    entry.entries.push(res);
                }
              if (!--pending) done(null, entry);
            });
          } else {
            if (file === "demo.js") {
                entry.isDemo = true;
            } else if (file === "demo.html") {
                entry.hasHtml = true;
            } else if (file === "demo.css") {
                entry.hasCss = true;
            } else if (file === "demo.details") {
                entry.hasDetails = true;
            }
            if (!--pending) done(null, entry);
          }
        });
      });
    });
  };

walk(baseDir, (err, entry) => {
    console.log(JSON.stringify(entry));
})