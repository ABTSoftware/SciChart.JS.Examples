import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>SciChart.js ships with a light and a dark theme, which you can switch by calling the SciChartSurface.applyTheme()
        function.</p>
    <h4>Tips!</h4>
    <p>If you implement IThemeProvider you can create your own custom themes! It's also possible to style chart-parts in
        code.
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlThemeManagerDocumentation}
               title={ExampleStrings.urlTitleThemeManagerDocumentation} target="_blank">The ThemeManager
            documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlStylingInCode}
               title={ExampleStrings.urlTitleStylingInCode}>Styling in Code Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates the <strong>light and dark theme</strong>{' '}
        in SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);


export const usingThemeManagerExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleThemeManager,
    path: ExampleStrings.urlThemeManager,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates our Light and Dark Themes for JavaScript Charts with SciChart.js ThemeManager API",
    seoKeywords: "theme, provider, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-themes.png"
};
