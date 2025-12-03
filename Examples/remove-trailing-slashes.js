/**
 * Recursively scans the /examples directory
 * and removes trailing slashes from URLs
 * that contain "scichart.com".
 *
 * Example:
 *   https://www.scichart.com/demo/react / → https://www.scichart.com/demo/react
 */

const fs = require("fs");
const path = require("path");

const URL_REGEX = /(https?:\/\/[^"'\s]*scichart\.com\/demo[^"'\s]*?)\/(?=["'\s])/g;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    const newContent = content.replace(URL_REGEX, "$1");

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log("- Updated:", filePath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);

    const DONT_TOUCH = ["node_modules", ".git", "build", "remove-trailing-slashes.js", "server"];

    for (const file of files) {
        if (DONT_TOUCH.includes(file)) {
            continue;
        }
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (stat.isFile()) {
            processFile(fullPath);
        }
    }
}

console.log("- Scanning `/examples` for `scichart.com/demo` URLs with trailing slashes...");
walk(__dirname);
console.log("Done! All URLs normalized.");
