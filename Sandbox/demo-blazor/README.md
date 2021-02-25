# SciChart.Blazor

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

## Experimental C# SciChart Wrapper - WrapperTest.razor

This demo is the very beginning of an attempt to wrap some of the core SciChart functionality using C#. This should make it easier to interact with the graph (adding series, updating data etc.) from your Blazor C# code.
