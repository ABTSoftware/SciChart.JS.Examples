const fs = require("fs");
const path = require("path");

// after-generate.js
//
// re-writes all exampleInfo.tsx files to replace const exampleImage = "my-image.jpg"
// with import exampleImage from "./my-image.jpg"
//
// Performs the inverse operation to before-generate.js

const getFilesInDirectory = async (pathUrl) => {
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
    for (const folder of folders) files.push(...(await getFilesInDirectory(path.join(pathUrl, folder.name))));

    return files;
};

function writeFile(targetFileName, fileText, platform) {
    if (!["win32", "darwin"].includes(platform)) {
        throw Error(`Platform ${platform} is not supported. Please run this script on Windows or macOS`);
    }
    fs.writeFileSync(targetFileName, fileText);
}

function replaceImportWithConst(targetFileName, exampleInfoText, platform) {
    if (!["win32", "darwin"].includes(platform)) {
        throw Error(`Platform ${platform} is not supported. Please run this script on Windows or macOS`);
    }
    console.log(`after-generate: Reverting file ${targetFileName}`);
    exampleInfoText = exampleInfoText.replace("const exampleImage = \"", "import exampleImage from \"./");
    writeFile(targetFileName, exampleInfoText, platform);
}

(async function () {
    const examplesPath = path.join(__dirname, "src", "components", "Examples");
    const files = await getFilesInDirectory(examplesPath);
    const exampleDefinitionFiles = files.filter((f) => f.fileName === "exampleInfo.tsx");
    const platform = process.platform;

    // Iterate through all exampleInfo.tsx.
    // Replace
    // "const exampleImage = "someimage.jpg"
    //  with
    // "import exampleImage from "./someimage.jpg";
    exampleDefinitionFiles.forEach((f) => {
        // Read the file and store this for later
        const exampleInfoText = fs.readFileSync(f.filePath, "utf-8");

        // Update the file and save
        replaceImportWithConst(f.filePath, exampleInfoText, platform);
    });
})();
