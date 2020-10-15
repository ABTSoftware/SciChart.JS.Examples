# BETA Testing SciChart.js 

The SciChart.js JavaSCript Charts Beta was released on 14th Oct 2020!   

**[See the release note here](https://www.scichart.com/scichart-js-ultra-high-performance-javascript-charts-beta/).**

We are now gathering feedback and would love to hear from our userbase about what needs to be improved before 
full release. 

### Bug reporting / suggestions in the BETA 

Found an issue or want to make a suggestion? We're inviting feedback via the [Github Issues in scichart.js.examples](https://github.com/ABTSoftware/SciChart.JS.Examples/issues) directly.

**For bug reports or improvements, please report here: https://github.com/ABTSoftware/SciChart.JS.Examples/issues**

### Running the SciChart.Js.Examples locally 

1. Start by cloning and running the Examples app at https://github.com/ABTSoftware/SciChart.JS.Examples
2. Now ```cd Examples``` run ```npm install```, and ```npm run dev``` to start the examples app. 

3. To run in production mode you will need to set a license key before you use SciChartSurface. The license key should be set once!
``` 
// LICENSING
// To license the examples app locally for beta, uncomment the line below
SciChartSurface.setRuntimeLicenseKey("WcnXtRLwGVtfNA59XwvDQA11wSpykEA1NEpARELTB+Aq6kf2nJSK9GgWOKvCJA6P+jNg2xcVLw3oM7EdIIi0MJtvorAARa9au01LV/xLJ1jdOeDeMXpw/eT5ajSpukKcJXHe97tzsBzfB6wRziW6LgNjuB3ykFIk+tGvOmJyhRewYjF+FCSb/0q8Bq8em4lNmOfONzJz5spVWvvfHdn5iIYfvv00hhduow4bFzxXnRucLtHl2Bm1yFvrVYe0UOQcFpJ9DZ4S96GLhSw9SIkUSAy/C5r3FvdCkX8d40ehAg+n78w92QXwh4B41xF0f+9OHpeV3byaZDNr5L1afdS3qCahoyeYEnmt4hYdmGH3uS+KtC29bAcVXUqNA9P3pESndALjlEimVNfr6RrfKEY3jroWtPXEx2Oo9XcD3ZLUJiRrjDL0lTf/3a6+KN1xsl2K2eymqyo9Wggy7Mf3WymmvURil7SaxE3xBP5LWWGPMEXvf9m7vXGz6fkEtsZhdEC3HQprBwEGyV1zPdLxDqtWO9ltEBEBlS2FrzJ3984/zSp9sbc=");
```
	This license key expires in 30 days - or 14th November 2020

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

The beta license key is already set in the tutorials.  If you are developing your own app you need to set this license key once in your app before calling SciChartSurface.create
```
import {SciChartSurface} from "scichart/charting/Visuals/SciChartSurface";

SciChartSurface.setRuntimeLicenseKey("WcnXtRLwGVtfNA59XwvDQA11wSpykEA1NEpARELTB+Aq6kf2nJSK9GgWOKvCJA6P+jNg2xcVLw3oM7EdIIi0MJtvorAARa9au01LV/xLJ1jdOeDeMXpw/eT5ajSpukKcJXHe97tzsBzfB6wRziW6LgNjuB3ykFIk+tGvOmJyhRewYjF+FCSb/0q8Bq8em4lNmOfONzJz5spVWvvfHdn5iIYfvv00hhduow4bFzxXnRucLtHl2Bm1yFvrVYe0UOQcFpJ9DZ4S96GLhSw9SIkUSAy/C5r3FvdCkX8d40ehAg+n78w92QXwh4B41xF0f+9OHpeV3byaZDNr5L1afdS3qCahoyeYEnmt4hYdmGH3uS+KtC29bAcVXUqNA9P3pESndALjlEimVNfr6RrfKEY3jroWtPXEx2Oo9XcD3ZLUJiRrjDL0lTf/3a6+KN1xsl2K2eymqyo9Wggy7Mf3WymmvURil7SaxE3xBP5LWWGPMEXvf9m7vXGz6fkEtsZhdEC3HQprBwEGyV1zPdLxDqtWO9ltEBEBlS2FrzJ3984/zSp9sbc=");
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


