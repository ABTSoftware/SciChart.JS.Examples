import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>With our ThemeManager API you can create a custom theme. To do this, create a type that implements all the
        properties of the IThemeProvider interface and pass to sciChartSurface.applyTheme.</p>
    <h4>Tips!</h4>
    <p>It's also possible to style chart-parts in code!
    </p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorialsHome} title={ExampleStrings.titleTutorialsHome} target="_blank">
            SciChart.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlCustomThemeDocumentation}
               title={ExampleStrings.urlTitleCustomThemeDocumentation} target="_blank">Custom Theme
            documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlThemeManager}
               title={ExampleStrings.urlTitleThemeManager}>ThemeManager Example</a></li>
        <li><a href={ExampleStrings.urlStylingInCode}
               title={ExampleStrings.urlTitleStylingInCode}>Styling in Code Example</a></li>
    </ul>
</div>);
const Subtitle = () => (
    <p>Demonstrates how to create a <strong>Custom Theme</strong>{' '}
        for SciChart.js, High Performance{' '}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript Charts</a></p>);


export const createACustomThemeExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleCustomTheme,
    path: ExampleStrings.urlCustomTheme,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
    seoDescription: "Demonstrates how to create a Custom Theme for a SciChart.js JavaScript Chart using our Theming API",
    seoKeywords: "theming, chart, javascript, webgl, canvas"
};
