import * as path from "path";
import * as fs from "fs";

export interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}

export let csStyles: IFiles;
export const loadStyles = async (folderPath: string) => {
    if (!csStyles) {
        const basePath = path.join(folderPath, "styles", "_base.scss");
        const base = await fs.promises.readFile(basePath, "utf8");
        const mixinsPath = path.join(folderPath, "styles", "mixins.scss");
        const mixins = await fs.promises.readFile(mixinsPath, "utf8");
        const examplesPath = path.join(folderPath, "styles", "Examples.module.scss");
        const examples = await fs.promises.readFile(examplesPath, "utf8");
        csStyles = {
            "src/styles/_base.scss": { content: base, isBinary: false },
            "src/styles/mixins.scss": { content: mixins, isBinary: false },
            "src/styles/Examples.module.scss": { content: examples, isBinary: false },
        };
    }
};
