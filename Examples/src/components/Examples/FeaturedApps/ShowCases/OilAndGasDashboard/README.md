# Oil and Gas Dashboard

## Overview

This example demonstrates an advanced Oil and Gas dashboard that combines multiple 2D, 3D, and vertically stacked charts to visualize key oil and gas exploration data. The dashboard consists of a sidebar featuring several small 2D charts (e.g. GR, RHDB, NPHI) and a main area containing a shale chart with a custom SVG grid background along with several vertical charts such as Density, Resistivity, Pore Space, Sonic, and Texture. The example is implemented using React with TypeScript and the SciChart.JS library to deliver high-performance charting capabilities.

## Technologies Used

-   React
-   TypeScript
-   SciChart.JS and SciChart-React
-   Material UI (for responsive design with useMediaQuery and useTheme)

## Code Explanation

The main component file is `index.tsx`, which defines the functional React component `OilAndGasDashboardShowcase`. This component uses SciChartReact components to initialize and render multiple charts. It also uses the `ChartGroupLoader` and groups several vertical charts with the `SciChartVerticalGroup` so that a unified rollover modifier is applied to them. In the component, sidebar 2D charts are conditionally rendered based on screen size (using Material UI’s `useMediaQuery` hook). The sidebar includes several individual SciChartReact components, each initialized via separate 2D chart initializer functions (e.g. `init2dFirstChart`, `init2dSecondChart`, etc.). Additionally, a 3D chart is rendered using the `SciChart3DSurface` component and its associated initializer function (`init3dChart`). The main container holds the vertical charts which are initialized using dedicated drawing functions (e.g. `drawShaleChart`, `drawDensityChart`, etc.). Other supporting files include:

-   **index.html & indexVerticalCharts.html**: Provide standalone HTML pages embedding the bundled JavaScript file and include basic CSS styling for layout and scrollbar customization.
-   **OIlGasStyles.css**: Contains CSS rules for styling the sidebar, grid layout, chart containers, legends and other UI elements used in the dashboard.
-   **theme.ts**: Defines theme configuration options for the dashboard. Several themes are provided (including dark, light, and a branded theme). The example uses a custom theme (App2022BrandTheme) which sets colors for various chart components such as the 3D chart colors, shale chart backgrounds, density chart fills, and cursor modifiers.

## Customization

Key configuration options available in this example include:

-   **Chart Grouping and Modifiers**: Vertical charts are grouped using `SciChartVerticalGroup` so that a single RolloverModifier can be configured for the entire set. The properties for the rollover line color and tooltip styling can be customized via the theme.

-   **Theming**: The example uses a custom theme defined in `theme.ts` (App2022BrandTheme) that controls colors for legends, backgrounds, grid lines, 3D chart elements, and individual vertical chart styling. Modifying these values will change the overall appearance of the charts.

-   **Layout and Styles**: The CSS in `OIlGasStyles.css` determines the layout of the sidebar and main container, as well as the dimensions of the individual chart items. Adjustments to flex-basis, height, and grid definitions allow for layout customization.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**: Install the necessary packages using npm:

    ```bash
    npm install
    ```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

    ```bash
    npm run dev
    ```

    This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
