import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import load500by500 from "../../PerformanceDemos/Load500By500/javascript-chart-load-500-series-by-500-points.jpg";
import ghostedTracesImg from "../../PerformanceDemos/RealtimeGhostedTraces/javascript-realtime-ghosted-traces-chart.jpg";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const previewDescription = `In this example we are simulating four channels of data showing that SciChart.js can be used to draw
real-time ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate,
SPO2 blood oxygen, volumetric flow and more.`;
const description = `SciChart.js will help you short-cut your development by providing rich, real-time high performance and
reliable charts for JavaScript medical and healthcare applications.`;
const tips = [
    `This example uses the GlowShaderEffect - an effect that can be tagged onto BaseRenderableSeries in SciChart
    to add oscilloscope/VDU style glow effects. A single point-marker is added to render the latest point which
    also has the glow applied. Try it out!`
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks"
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ghostedTracesImg,
                title: ExampleStrings.titleRealtimeGhostedTraces,
                seoTitle: ExampleStrings.urlTitleRealtimeGhostedTraces,
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: load500by500,
                title: ExampleStrings.titleLoad500By500,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoad500By500
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Showcases how SciChart.js can be used in a <strong>Medical context</strong>, drawing ECGs with our High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </>
);
export const vitalSignsMonitorDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleVitalSigns,
    path: ExampleStrings.urlVitalSigns,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription: `In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time
        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood
        oxygen, volumetric flow and more.`,
    seoKeywords: "ecg, ekg, realtime, medical, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-vital-signs-ecg-medical-chart-example.jpg"
};
