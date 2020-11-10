# BETA Testing SciChart.js 

The SciChart.js JavaScript Charts Beta was released on 14th Oct 2020!   

> **[See the SciChart.js Beta release note here](https://www.scichart.com/scichart-js-ultra-high-performance-javascript-charts-beta/).**

We are now gathering feedback and would love to hear from our user base about what needs to be improved before 
full release. 

### Bug reporting / suggestions in the BETA 

Found an issue or want to make a suggestion? We're inviting feedback via our [Support desk](https://support.scichart.com/) directly.

**For bug reports or improvements, please report here: https://support.scichart.com/**

### Running the SciChart.Js.Examples locally 

1. Get a trial license key from https://www.scichart.com/licensing-scichart-js/ and install **licensing wizard**. Purchased license keys can be viewed at https://www.scichart.com/profile
2. Clone the Examples app at https://github.com/ABTSoftware/SciChart.JS.Examples
3. Having the **licensing wizard** running ```cd Examples``` run ```npm install```, and ```npm run dev``` to start the Examples app. 

4. To run in production mode you will need to set a license key before you use SciChartSurface. The license key should be set once! 
    * for the Examples app set license key here `Examples/webpack.client.no_server.config.js`
    * for any of tutorials set it in `src/index.js`
``` 
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.
```

### Creating your own SciChart.js App

We've prepared a few tutorials to get you started. There are three right now and we will be adding more shortly. 

1. Tutorial 01 - [Creating an Application with SciChart](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html)
2. Tutorial 02 - [Adding Data and Series](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2002%20-%20Adding%20Series%20and%20Data.html)
3. Tutorial 03 - [Adding Zooming and Panning](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2003%20-%20Adding%20Zooming,%20Panning%20Behavior.html)

To run a tutorial: 
* navigate to the tutorial folder
* run `npm install`
* run `npm start`

_Further tutorials are in development_

If you are developing your own app you need to set this license key once in your app before calling SciChartSurface.create
```
import {SciChartSurface} from "scichart/charting/Visuals/SciChartSurface";

SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
```
### Exploring our API

The [SciChart.js Documentation](http://scichart.com/javascript-chart-documentation) has gone live. This contains pages covering our main API points for 2D Charts (3D Charts to follow soon). 

There is also a [TypeDoc documentation](https://www.scichart.com/documentation/js/current/typedoc/globals.html) which covers the types throughout SciChart.js.

We've published the demo application to [demo.scichart.com](https://demo.scichart.com) so you can explore the features in our JavaScript Chart API. 

## NOTES

* SciChart.js is written in TypeScript but supports both JavaScript and TypeScript applications. 

* Our initial BETA release requires webpack to distribute the WebAssembly files (wasm). You can find out more about setting up webpack in [Tutorial #1](https://www.scichart.com/documentation/js/current/webframe.html#Tutorial%2001%20-%20Setting%20up%20a%20Project%20with%20SciChart.js.html).

* SciChart.js works on all modern browsers, but requires WebAssembly and at least WebGL1. A list of compatible browsers can be [found here](https://www.scichart.com/documentation/js/current/webframe.html#Minimum%20Browser%20Requirements.html).

* We're building more tutorials, more examples and features as we speak. If you have a bug report or want to request a feature, use the [Github Issues list](https://github.com/ABTSoftware/SciChart.JS.Examples/issues)!  


