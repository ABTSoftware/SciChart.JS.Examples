import { EXAMPLES_PAGES, TExamplePage } from "../../components/AppRouter/examplePages";

export const htmlTemplate = (options?: { body?: string; styles?: string }) =>
    `<html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>SciChart Example</title>
        <script type="importmap">
            {
                "imports": {
                    "./drawExample": "./drawExample.js",
                    "scichart-example-dependencies": "./exampleDependencies.browser.mjs",
                    "scichart": "./scichart.browser.mjs"
                }
            }
        </script>
        <script async type="module" src="scichart.browser.mjs"></script>
        <script async type="module" src="index.js"></script>
        <script async type="module" src="drawExample.js"></script>
        <script async type="module" src="common.js"></script>
        <script async type="module" src="exampleDependencies.browser.mjs"></script>
        <style>
            body {
                font-family: "Arial";
            }
            ${options?.styles ?? ""}
        </style>
    </head>
    <body>
        ${options?.body ?? `<div id="chart"></div>`}
    </body>
</html>`;

const generateLinkToVanillaExample = (entry: TExamplePage) => {
    const link = `/vanillaDemo/${entry.path}/index.html?nav=1`;
    return `<li><a href="${link}">${entry.title}</a>`;
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

export const templateWithNav = (options?: { body?: string; styles?: string }) =>
    `<html lang="en-us">
        <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <base href="vanillaDemo" />
        <title>SciChart Example</title>
        <script type="importmap">
            {
                "imports": {
                    "./drawExample": "./drawExample.js",
                    "scichart-example-dependencies": "./exampleDependencies.browser.mjs",
                    "scichart": "./scichart.browser.mjs"
                }
            }
        </script>
        <script async type="module" src="scichart.browser.mjs"></script>
        <script async type="module" src="index.js"></script>
        <script async type="module" src="drawExample.js"></script>
        <script async type="module" src="common.js"></script>
        <script async type="module" src="exampleDependencies.browser.mjs"></script>
            <style>
                body {
                    font-family: "Arial";
                }
                ${options?.styles ?? ""}
            </style>
        </head>
        <body>
            <div style="display: flex">
                <div style="flex-basis: 400px; border: 1; height: 100vh; overflow-x:auto; overflow-y:auto">
                    ${nav}
                </div>
                <div style="flex: auto;">
                    ${options?.body ?? `<div id="chart"></div>`}
                </div>
            </div>
        </body>
    </html>`;
