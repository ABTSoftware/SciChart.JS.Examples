/**
 * Recursively scans the /examples directory
 * and ADDS trailing slashes to scichart.com/demo
 * URLs INSIDE MARKDOWN LINKS SAFELY.
 *
 * Example:
 * [Demo](https://www.scichart.com/demo/react)
 * → [Demo](https://www.scichart.com/demo/react/)
 */

const fs = require("fs");
const path = require("path");

const MD_URL_REGEX = /\]\((https?:\/\/(?:www\.)?scichart\.com\/demo(?:\/[^\s)"]*)?)\)/g;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    const newContent = content.replace(MD_URL_REGEX, (match, url) => {
        // If it already ends with slash, leave it alone
        if (url.endsWith("/")) return match;

        return `](${url}/)`;
    });

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log("- Updated:", filePath);
    } else {
        // console.log("- No changes needed:", filePath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);

    const DONT_TOUCH = [
        "node_modules",
        ".git",
        "build",
        "remove-trailing-slashes.js",
        "add-trailing-slashes.js",
        "server",
    ];

    for (const file of files) {
        if (DONT_TOUCH.includes(file)) continue;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (stat.isFile()) {
            processFile(fullPath);
        }
    }
}

console.log("- Scanning `/examples` for Markdown demo links without trailing slashes...");
const targetDir = path.join(__dirname, "../src", "components", "Examples");
walk(targetDir);
console.log("Done! All Markdown demo links are now slash-safe.");
