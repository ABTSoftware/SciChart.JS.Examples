import { EXAMPLES_PAGES, TExamplePage } from "../../components/AppRouter/examplePages";
import { EPageFramework, getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";

const generateLinkToVanillaExample = (entry: TExamplePage) => {
    const link = `/vanillaDemo/${entry.path}/index.html?nav=1`;
    return `<li><a href="${link}">${getTitle(entry.title, EPageFramework.Vanilla)}</a>`;
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

export const htmlTemplate = (options?: { body?: string; styles?: string; renderNav?: boolean }) =>
    `<html lang="en-us">
        <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <base href="vanillaDemo" />
        <title>SciChart Example</title>
        <script type="importmap">
            {
                "imports": {
                    "../../../theme": "./theme.js",
                    "./drawExample": "./drawExample.js",
                    "./data": "./data.js",
                    "./DepthCursorModifier": "./DepthCursorModifier.js",
                    "scichart": "./scichart.browser.mjs"
                }
            }
        </script>
        <script type="module" src="scichart.browser.mjs"></script>
        <script type="module" src="common.js"></script>
        <script type="module" src="index.js"></script>
        <script type="module" src="drawExample.js"></script>
            <style>
                body {
                    font-family: "Arial";
                }
                ${options?.styles ?? ""}
            </style>
        </head>
        <body>
            <div style="display: flex">
                ${
                    options.renderNav
                        ? `<div style="flex-basis: 400px; border: 1; height: 100vh; overflow-x:auto; overflow-y:auto">
                    ${nav}
                </div>`
                        : ""
                }
                <div style="flex: auto;">
                    ${options?.body ?? `<div id="chart"></div>`}
                </div>
            </div>
        </body>
    </html>`;
