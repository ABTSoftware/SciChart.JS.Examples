### How to add examples to Examples App

**For SciChart Developers and partners only**

To add an example to the SciChart.js Examples Suite, use the following steps:

* **Create folder** for your example, (e.g. `Examples/src/components/Examples/Charts2D/BasicChartTypes/BandSeriesChart/`)
* **Place example code**. In the example folder create `index.tsx` file and put code for your example into it.
* **Add metadata**. In the example folder create metadata file `exampleInfo.ts` 
```ts
import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const previewDescription = `Demonstrates how to create a JavaScript Spline Band Chart. This is a chart type which draws an area (polygon
    or fill) between two lines. The FastBandRenderableSeries requires an XyyDataSeries, which contains one
    X-point and two Y-points`;
    
const description = `Dual lines are drawn by the stroke, strokeY1 properties and shaded bands are drawn by the fill and fillY1
properties, depending on whether y1 is greater than y2`;

const tips = [
    `If you have data where Y1 is greater than Y2 always, you’ll get an envelope effect. Great for rendering
    confidence intervals, error margins or Bollinger Bands!`,
    ...
];

const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
   ...
];

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: ExampleStrings.imgMultiPaneStockChart,
                title: ExampleStrings.titleMultiPaneStockChart,
                seoTitle: ExampleStrings.urlTitleMultiPaneStockChart,
                examplePath: ExampleStrings.urlMultiPaneStockChart
            },
            ...
        ]
    }
];

const Subtitle = () => (
    <p>
        ...
    </p>
);

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBandChart,
    path: ExampleStrings.urlBandChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    seeAlso,
    code,
    githubUrl,
    seoDescription:
        "Demonstrates how to create a JavaScript Band Chart. This is a chart type which draws an area (polygon or fill) " +
        "between two lines. The Band series requires one X-point and two Y-points to draw the polygon",
    seoKeywords: "band, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-band-chart.jpg"
};
```
* **Generate GENERATED_SRC.ts, GENERATED_GITHUB_URL.ts files** - run `npm run generateExampleSrc` to generate `GENERATED_SRC.ts`. Note if you modify any of index.tsx in the examples folder, you also need to run the script.

* **Add example to menu**

Edit `Examples/src/components/AppRouter/examplePages.ts` to add new example

```ts
import { bandSeriesChartExampleInfo } from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart/exampleInfo";
...

export const EXAMPLES_PAGES = asRecord({
    ...
    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        ...bandSeriesChartExampleInfo
    }
    ...
})
```

And this file `Examples/src/components/AppRouter/examples.ts`
```ts
import BandSeriesChart from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart";

...

export const MENU_ITEMS_2D: TMenuItem[] = [
    {
        item: { id: "chart2D_basicCharts", name: "JavaScript Chart Types" },
        submenu: [
            ...
            EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart,
            ...
        ]
    }
]

...

export const getExampleComponent = (exampleId: string): (() => JSX.Element) => {
    switch (exampleId) {
        ...
        case EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.id:
            return BandSeriesChart;
        ...
}

```
* **Add example to search** - edit `Examples/src/components/Search/searchItems.ts`
```ts
...
export const searchItems: TSearchItem[] = [
    ...
    { title: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.title, link: EXAMPLES_PAGES.chart2D_basicCharts_BandSeriesChart.path }
];

...
```

* **Update sitemap**
`npm run generateSitemap`
