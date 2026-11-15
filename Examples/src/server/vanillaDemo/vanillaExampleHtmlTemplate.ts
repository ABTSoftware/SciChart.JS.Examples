import { EXAMPLES_PAGES, TExamplePage } from "../../components/AppRouter/examplePages";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";

const generateLinkToVanillaExample = (entry: TExamplePage) => {
    const link = `/vanillaDemo/${entry.path}/index.html?nav=1`;
    return `<li><a href="${link}">${getFrameworkContent(entry.title, EPageFramework.Vanilla)}</a>`;
};

const generateNav = () => {
    let html = `<ul>`;
    Object.values(EXAMPLES_PAGES).forEach((page) => {
        html += generateLinkToVanillaExample(page);
    });

    html += `</ul>`;
    return html;
};

const nav = generateNav();

export const htmlTemplate = (options: { imports: Record<string, string>; renderNav?: boolean }) =>
    `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SciChart Example</title>
        <script type="importmap">${JSON.stringify({ imports: options.imports })}</script>
        <link rel="stylesheet" href="./styles.css" />
        <script type="module" src="./index.js"></script>
    </head>
    <body style="margin: 0; height: 100vh;">
        <div style="display: flex; height: 100%;">
            ${options.renderNav ? `<nav style="flex: 0 0 25rem; height: 100%; overflow: auto;">${nav}</nav>` : ""}
            <div id="chart" style="flex: 1; min-width: 0; height: 100%;"></div>
        </div>
    </body>
</html>`;
