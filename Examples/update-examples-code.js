const fs = require("fs");
const path = require("path");

async function getFiles(pathUrl) {
    const entries = await fs.promises.readdir(pathUrl, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter((file) => !file.isDirectory())
        .map((file) => ({
            fileName: file.name,
            fileDir: pathUrl,
            filePath: path.join(pathUrl, file.name),
        }));

    // Get folders within the current directory
    const folders = entries.filter((folder) => folder.isDirectory());

    // Add the found files within the subdirectory to the files array
    for (const folder of folders) files.push(...(await getFiles(path.join(pathUrl, folder.name))));

    return files;
}

function updateExample(targetFileDir, srcText, platform) {
    if (!["win32", "darwin"].includes(platform)) {
        throw Error(`Platform ${platform} is not supported. Please run this script on Windows or macOS`);
    }
    const isWindows = platform === "win32";
    const targetFileSrc = path.join(targetFileDir, "GENERATED_SRC.ts");
    fs.writeFileSync(
        targetFileSrc,
        `export const code = \`${srcText}\`;`
    );

    const targetFileGithubUrl = path.join(targetFileDir, "GENERATED_GITHUB_URL.ts");
    const targetFileDirUnix = isWindows ? targetFileDir.replace(/\\/g, "/") : targetFileDir;
    if (isWindows) {
        const targetFileDirUnix = targetFileDir.replace(/\\/g, "/");
    }
    const position = targetFileDirUnix.search("/components/Examples");
    const githubUrl = targetFileDirUnix.substring(position) + "/index.tsx";
    fs.writeFileSync(targetFileGithubUrl, `export const githubUrl = "${githubUrl}";`);
}

(async function () {
    const examplesPath = path.join(__dirname, "src", "components", "Examples");
    const files = await getFiles(examplesPath);
    const srcFiles = files.filter((f) => f.fileName === "index.tsx");
    const platform = process.platform;
    srcFiles.forEach((f) => {
        const srcText = fs.readFileSync(f.filePath, "utf-8");
        updateExample(f.fileDir, srcText, platform);
    });
})();
