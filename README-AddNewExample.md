### How to add examples to Examples App

**For SciChart Developers and partners only**

To add an example to the SciChart.js Examples Suite, use the following steps:

* **Create folder** for your example, (e.g. `Examples/src/components/Examples/Charts2D/BasicChartTypes/BandSeriesChart/`)
* **Place example code**. In the example folder create `index.tsx` file and put code for your example into it.
* **Add metadata**. In the example folder create metadata file `exampleInfo.ts` 
```ts
import * as React from "react";
import {TExampleInfo} from "../../../../AppRouter/examplePages";
import {code} from "./GENERATED_SRC";
import {githubUrl} from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

...

export const bandSeriesChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBandChart,
    path: ExampleStrings.urlBandChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
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
