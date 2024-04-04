import * as fs from "fs";
import { EXAMPLES_PAGES } from "./src/components/AppRouter/examplePages";
import { TFooterlink } from "./src/components/AppFooter/AppFooter";
import { getTitle, EPageFramework } from "./src/helpers/shared/Helpers/frameworkParametrization";

console.log("Generating footer links...");

(async () => {
    const links: TFooterlink[] = [];

    // Add examples links
    Object.values(EXAMPLES_PAGES).forEach(el => {
        links.push({
            link: el.path,
            text: getTitle(el.title, EPageFramework.Vanilla)
        });
    });

    const linksStr = `export const FOOTER_LINKS = ${JSON.stringify(links)}`;

    fs.writeFile("./src/components/AppFooter/GENERATED_FOOTER_LINKS.ts", linksStr, err => {
        if (err) console.log(err);
        console.log("GENERATED_FOOTER_LINKS.ts is successfully written to file.");
    });
})();
