# SciChart.Blazor

## Trial licensing

Ensure you have followed steps from our [getting-started](https://www.scichart.com/getting-started-scichart-js) guide to get a trial!

## Running the SciChart.js Blazor Boilerplate 

To run the demo you'll need .NET 5.

With that you can then launch the demo application from the command line:

``` powershell
cd SciChartDemo.Client
dotnet watch run
```

This will launch the app using dotnet watch so the app will automatically build every time you change the code.

As part of the build process MSBuild will run NPM to download the core SciChart javascript dependencies, it will also run webpack to copy those dependencies across to the wwwroot folder.

There are two demos to explore so far:

## JS Chart - Index.razor

The core demo relies on [JsLib/src/demo.js](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Sandbox/demo-blazor/SciChartDemo.Client/JsLib/src/demo.js).

With this demo you need to write all your chart logic/configuration in demo.js.

# How we created this project using Blazor's JavaScript Interop 

The below is a walkthrough of how we created this JavaScript interop demo of SciChart.js to Blazor. Currently we only support JavaScript interop.

**Setting up JS Scripts**

1. We created a new Blazor WASM project using the standard dotnet template (via VS or the CLI...)

``` dotnet new blazorwasm -o ExampleProject ```

2. Inside that project (ExampleProject in this case), we created a folder to store the javascript libraries and scripts (e.g. JsLib)
3. In there, we created the [package.json](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/dev/Sandbox/demo-blazor/SciChartDemo.Client/JsLib/package.json) and [webpack.config.js](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/dev/Sandbox/demo-blazor/SciChartDemo.Client/JsLib/webpack.config.js) files. Notice that the Webpack.config has rules to copy scichart2d.data and scichart2d.wasm into the wwwroot output folder - this is necessary for SciChart.js
4. With the project setup like this, if you restore all node modules (using yarn or npm, from the JsLib folder) this will download the necessary packages
5. We created a subfolder (inside JsLib) called src and in there create a JS file called [demo.js](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/dev/Sandbox/demo-blazor/SciChartDemo.Client/JsLib/src/demo.js) (this is where your chart code goes)

**Referencing JS Scripts**

6. In your blazor application [wwwroot/index.html](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/dev/Sandbox/demo-blazor/SciChartDemo.Client/wwwroot/index.html) We've modified the head to include references to:
 - sciChart.js
 - your-chart-js-file.js (e.g. demo.js)
 
```
<script src="demo.js"></script>
<script src="sciChart.js"></script>    
```

Note, this file will be copied from the node_modules folder to the wwwroot folder when you run the webpack script...

**Using SciChart.js in a .razor file**

In our [Index.razor](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/dev/Sandbox/demo-blazor/SciChartDemo.Client/Pages/Index.razor) file you can see how we're initializing the chart demo and calling functions in javascript using JavaScript interop. 

**At this point you can "build" the JS source via webpack using yarn build or npm run build from inside the JsLib folder.**

Next you just need to launch the Blazor project, which you can do from Visual Studio or the command line (from the project root folder):

```dotnet run```


# Experimental C# SciChart Wrapper - WrapperTest.razor

We are also looking to wrap some of the core SciChart functionality using C#. This should make it easier to interact with the graph (adding series, updating data etc.) from your Blazor C# code. However, this work is in a very early stage. 

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

* [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
* [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
* [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
* [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
