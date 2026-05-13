const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { URL } = require("url");

// This script checks all links in markdown files within the 'Examples' directory and its subdirectories.
// To run: "npm run linkcheck"

const examplesDir = path.join(__dirname, ".", "../src");
const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g; // markdown links: [text](url)

let fileCount = 0;
let linkCount = 0;
let errorCount = 0;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath, callback);
        } else if (fullPath.endsWith(".md") || fullPath.endsWith(".mdx") || fullPath.endsWith(".tsx")) {
            callback(fullPath);
        }
    });
}

function checkLink(url) {
    return new Promise((resolve) => {
        let lib = url.startsWith("https") ? https : http;
        let req;
        try {
            req = lib.request(url, { method: "HEAD", timeout: 5000 }, (res) => {
                resolve({ url, status: res.statusCode });
            });
            req.on("error", () => {
                // Try GET if HEAD fails (some servers don't support HEAD)
                req = lib
                    .get(url, { timeout: 5000 }, (res) => {
                        resolve({ url, status: res.statusCode });
                    })
                    .on("error", () => {
                        resolve({ url, status: "ERR" });
                    });
            });
            req.on("timeout", () => {
                req.destroy();
                resolve({ url, status: "TIMEOUT" });
            });
            req.end();
        } catch (e) {
            resolve({ url, status: "ERR" });
        }
    });
}

async function checkLinksInFile(filePath) {
    fileCount++;

    const content = fs.readFileSync(filePath, "utf8");
    const links = [];
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[2]);
    }
    if (links.length === 0) return;

    for (const url of links) {
        try {
            // Validate URL
            new URL(url);
        } catch {
            console.log(`  Invalid URL: ${url}`);
            continue;
        }
        const { status } = await checkLink(url);
        if (status === 404) {
            console.log(`  ❌ 404 Not Found: ${url} (in file: ${filePath})`);
            errorCount++;
        } else if (status === "ERR") {
            console.log(`  ⚠️  Error: ${url}`);
            errorCount++;
        } else if (status === "TIMEOUT") {
            console.log(`   Timeout: ${url}`);
            errorCount++;
        } else {
            // console.log(`✅ ${status}: ${url}`);
        }
        linkCount++;
    }
}

// Main
(async () => {
    console.log('Starting link checking in "/Examples/src" directory...');

    const files = [];
    walkDir(examplesDir, (file) => files.push(file));
    for (const file of files) {
        await checkLinksInFile(file);
    }
    console.log("\nLink check complete.");
    console.log(`Total files checked: ${fileCount}`);
    console.log(`Total links checked: ${linkCount}\n`);
    if (errorCount > 0) {
        console.error(`\x1b[31mTotal errors found: ${errorCount}\x1b[0m`);
    } else {
        console.log("\x1b[32mAll links are valid!\x1b[0m");
    }
})();
