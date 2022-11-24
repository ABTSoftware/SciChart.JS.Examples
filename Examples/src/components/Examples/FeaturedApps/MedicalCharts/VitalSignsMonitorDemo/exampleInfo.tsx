import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-vital-signs-ecg-medical-chart-example.jpg";

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
                imgPath: ExampleStrings.imgRealtimeGhostedTracesChart,
                title: ExampleStrings.titleRealtimeGhostedTraces,
                seoTitle: ExampleStrings.urlTitleRealtimeGhostedTraces,
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: ExampleStrings.imgLoad500by500Charts,
                title: ExampleStrings.titleLoad500By500,
                seoTitle: ExampleStrings.urlTitleLoad500By500,
                examplePath: ExampleStrings.urlLoad500By500
            }
        ]
    }
];

const Subtitle = () => (
    <p>
        Showcases how SciChart.js can be used in a <strong>Medical context</strong>, drawing ECGs with our High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

export const vitalSignsMonitorDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleVitalSigns,
    pageTitle: ExampleStrings.titleVitalSigns + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlVitalSigns,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    metaDescription: `In this example we are simulating four channels of data showing that SciChart.js can be used to draw real-time
        ECG/EKG charts and graphs to monitor heart reate, body temperature, blood pressure, pulse rate, SPO2 blood
        oxygen, volumetric flow and more.`,
    metaKeywords: "ecg, ekg, realtime, medical, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
