import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import Gallery from "../../../../Gallery/Gallery";
import { GalleryItem } from "../../../../../helpes/types/types";
import verticalChart from "../../ModifyAxisBehavior/VerticalCharts/javascript-vertical-charts.jpg";
import secondaryYAxis from "../../ModifyAxisBehavior/SecondaryYAxes/javascript-chart-with-secondary-y-axis.jpg";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const description = `Demonstrates how to add behaviour to scale, zoom or pan a chart by dragging the X or Y Axis on the chart.
Try it out below! Drag an axis to watch the chart re-scale.`;
const tips = [`Try dragging an axis to zoom or pan the axis. Double clicking the chart resets the zoom!`];

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
    }
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: secondaryYAxis,
                title: ExampleStrings.titleSecondaryYAxis,
                seoTitle: ExampleStrings.urlTitleSecondaryYAxis,
                examplePath: ExampleStrings.urlSecondaryYAxis
            },
            {
                imgPath: verticalChart,
                title: ExampleStrings.titleVerticalCharts,
                seoTitle: ExampleStrings.urlTitleVerticalCharts,
                examplePath: ExampleStrings.urlVerticalCharts
            }
        ]
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Subtitle = () => (
    <p>
        Demonstrates how to <strong>scale or pan the Axis on a JavaScript Chart</strong> using SciChart.js, High
        Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const Description = () => (
    <div>
        <ExampleDescription documentationLinks={documentationLinks} tips={tips} description={description} />
    </div>
);

export const dragAxisToScaleExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleDragAxisToScale,
    path: ExampleStrings.urlDragAxisToScale,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to Zoom, Scale or Pan individual Axis on a JavaScript Chart with SciChart.js AxisDragModifiers",
    seoKeywords: "drag, axis, scale, javascript, webgl, canvas",
    thumbnailImage: "drag-axis-on-javascript-charts-to-scale-or-pan.jpg"
};
