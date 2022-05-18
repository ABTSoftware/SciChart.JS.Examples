import * as path from "path";
import { Dirent, promises } from "fs";
import * as gulp from "gulp";
// tslint:disable:no-var-requires
const smushit = require("gulp-smushit");

type TFileInfo = {
    fileName: string;
    fileDir: string;
    filePath: string;
};

const args = process.argv.slice(2);
const folderParam = args[0];

async function getFiles(pathUrl: string) {
    const entries = await promises.readdir(pathUrl, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter((file: Dirent) => !file.isDirectory())
        .map((file: Dirent) => ({
            fileName: file.name,
            fileDir: pathUrl,
            filePath: path.join(pathUrl, file.name)
        }));

    // Get folders within the current directory
    const folders = entries.filter((folder: Dirent) => folder.isDirectory());

    // Add the found files within the subdirectory to the files array
    for (const folder of folders) files.push(...(await getFiles(path.join(pathUrl, folder.name))));

    return files;
}

(async () => {
    const examplesPath = path.join(__dirname, "src", "components", "Examples");
    const files = await getFiles(examplesPath);
    const imageFiles = files.filter((f: TFileInfo) => {
        const isCorrectFileType = f.fileName?.includes(".jpg") || f.fileName?.includes(".png");
        const isFolderIncluded = folderParam ? f.fileDir?.includes(folderParam) : true;
        return isCorrectFileType && isFolderIncluded;
    });

    for (const imageFile of imageFiles) {
        try {
            console.log("compressing image " + imageFile.filePath);
            gulp.src(imageFile.filePath)
                .pipe(smushit({ verbose: false }))
                .pipe(gulp.dest(imageFile.fileDir));
        } catch (err) {
            console.warn(err);
        }
    }
})();
