import express from "express";
var url = require("url");
import * as fs from "fs";
import { EXAMPLES_PAGES } from "../../components/AppRouter/examplePages";
import { TFrameworkName, TFrameworkTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";

const router = express.Router();

const getContent = (item: TFrameworkTemplate) => {
    if (!item) return "";
    return typeof item === "string" ? item : item("{framework}" as unknown as TFrameworkName);
};

router.get("/", async (req, res) => {
    const dataList = [];
    let csv = `path;title;pageTitle;subtitle;metaDescription;metaKeywords;markdownContent;documentationLinks`;
    for (const exampleKey in EXAMPLES_PAGES) {
        const exampleInfo = EXAMPLES_PAGES[exampleKey];
        const item = {
            path: exampleInfo.path,
            title: getContent(exampleInfo.title),
            pageTitle: getContent(exampleInfo.pageTitle),
            subtitle: exampleInfo.subtitle("{framework}"),
            metaDescription: getContent(exampleInfo.metaDescription),
            metaKeywords: exampleInfo.metaKeywords,
            markdownContent: getContent(exampleInfo.markdownContent).toString(),
            documentationLinks: exampleInfo.documentationLinks,
        };
        const subtitle = JSON.stringify(exampleInfo.subtitle("{framework}"), (key, value) =>
            ["key", "ref", "_owner"].includes(key) ? undefined : value
        );
        const line = `^${item.path}^;^${item.title}^;^${item.pageTitle}^;^${subtitle}^;^${item.metaDescription}^;^${
            item.metaKeywords
        }^;^${item.markdownContent}^;^${JSON.stringify(item.documentationLinks)}^`;
        dataList.push(item);
        csv += "\n" + line;
    }
    fs.writeFileSync(
        "exampleInfo.json",
        JSON.stringify(dataList, (key, value) => (["key", "ref", "_owner"].includes(key) ? undefined : value))
    );
    fs.writeFileSync("exampleInfo.csv", csv);
    res.send(dataList);
});

export { router as exportExampleInfo };
