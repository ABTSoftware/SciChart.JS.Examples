# SciChartExamples

## How to add examples to Examples App

* **Create folder** for your example, (e.g. `Examples/src/components/Examples/Charts3D/Basic3DChartTypes/Scatter3DChart/`)
* **Place example code**. In the example folder create `index.tsx` file and put code for your example into it.
* **Add metadata**. In the example folder create metadata file `exampleInfo.ts` 
```ts
import { TExampleInfo } from "../../../../AppRouter/examples";
import { code } from "./GENERATED_SRC";

export const scatter3DChartExampleInfo: TExampleInfo = {
    title: "Bubble 3D Chart",
    path: "/chart3D_Basic3DChartTypes_Bubble",
    subtitle: "Bubble 3D Chart subtitle",
    description: "Bubble 3D Chart description",
    code
};
```
* **Generate GENERATED_SRC.ts file** - run `npm run generateExamplesSrc` to generate `GENERATED_SRC.ts`. Note if you modify any of index.tsx in the examples folder, you also need to run the script.

* **Add example to menu** - edit `Examples/src/components/AppRouter/examples.ts` file to add new example
```ts
import { scatter3DChartExampleInfo } from "../Examples/Charts3D/Basic3DChartTypes/Scatter3DChart/exampleInfo";
import Scatter3DChart from "../Examples/Charts3D/Basic3DChartTypes/Scatter3DChart";
...
export const EXAMPLES_PAGES: Record<string, TExamplePage> = {
    ...
    chart3D_Basic3DChartTypes_Scatter: {
        id: "chart3D_Basic3DChartTypes_Scatter",
        Component: Scatter3DChart,
        ...scatter3DChartExampleInfo
    }
};

export const MENU_ITEMS: TMenuItem[] = [
    ...
    {
        item: { id: "chart3D_Basic3DChartTypes", name: "Basic 3D Chart Types" },
        submenu: [EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter]
    }
];
```
* **Add example to search** - edit `Examples/src/components/Search/searchItems.ts`
```ts
...
export const searchItems: TSearchItem[] = [
    ...
    { title: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter.title, link: EXAMPLES_PAGES.chart3D_Basic3DChartTypes_Scatter.path }
];

```
