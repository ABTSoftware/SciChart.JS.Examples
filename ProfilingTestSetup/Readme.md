# SciChart.js Chart Performance Measurement and Testing

This project is a work in progress and demonstrates two features:

- a setup for debugging chart performance and memory usage
- automated tests using Playwright

## TLDR

A performance profiling and testing framework for SciChart.js that provides:

- **Interactive debugging app** with configurable chart parameters and real-time performance monitoring
- **Automated Playwright tests** for systematic performance measurement across different configurations
- **Modular `ChartInitializer` architecture** with granular control over chart lifecycle, data updates, and performance tracking
- **Two-level profiling**: lightweight tracing for minimal overhead and detailed debug mode for deep analysis
- **Test report generation** with visual comparison of performance metrics across test runs
- **Memory and performance tracking APIs** with console output control via `enableConsoleOutput` flag

**Quick Start**: `npm install && npm run dev` for the interactive app, or `npm run test:full` for automated testing with reports.

---

## Table of Contents

- [SciChart.js Chart Performance Measurement and Testing](#scichartjs-chart-performance-measurement-and-testing)
  - [TLDR](#tldr)
  - [Table of Contents](#table-of-contents)
  - [Goal](#goal)
  - [Description](#description)
    - [Project structure](#project-structure)
      - [Main app](#main-app)
      - [Test Client App](#test-client-app)
      - [Playwright Testing App](#playwright-testing-app)
      - [Test Report App](#test-report-app)
  - [Running the project](#running-the-project)
    - [Main App](#main-app-1)
    - [Automated Tests](#automated-tests)
      - [Test Results Report](#test-results-report)
      - [Other options](#other-options)
      - [Results Location](#results-location)
  - [How to use the Main App](#how-to-use-the-main-app)
    - [Memory Debugging](#memory-debugging)
      - [Browser Dev-tools](#browser-dev-tools)
      - [Memory Usage Tracing](#memory-usage-tracing)
      - [Memory Debug Logs](#memory-debug-logs)
    - [Performance Debugging](#performance-debugging)
      - [Performance Debug Logs](#performance-debug-logs)
      - [Performance Metrics Tracing](#performance-metrics-tracing)
    - [Setup Customization](#setup-customization)

---

## Goal

This project is a public version of a setup that is supposed to help with the performance profiling.

Currently it is work in progress and the project is in a draft state.  
So, some of the features may not work.  
Some of the further ideas are listed in the [TODO](./TODO) file.
Let us know if you find this demo useful or need some assistance with it.

---

Chart rendering performance depends on multiple factors.  
With this setup we try to demonstrate some approaches of how a chart setup could be configured and profiled.

For example, we implemented `ChartInitializer` class that consists of methods that are responsible for granular chart configuration areas.  
Those areas include:

- engine and chart initialization;
- axes configuration;
- sub-charts configuration;
- series configurations;
- other surface configurations;
- Data Series configurations;
- data update configuration (data generation, append/remove, update frequency, pacing);
- APIs related to performance measurement and output

and more.

By separating the configuration logic into this structure we could easily try different approaches by overriding those methods or extending them with additional logic.  
And, by dividing those operations into distinct steps we can measure the performance and memory footprint they create.

---

To be more specific, the setup allows to perform profiling at different levels:

- Top level (Lets refer to it as _Tracing_), which measures the mentioned configuration steps and creates only a minimal overhead while collecting the profiled data.

- Detailed (Debug Mode), that uses `PerformanceDebugHelper` and `MemoryDebugHelper` APIs to collect information about internal chart processes and entities. It breaks down the rendering process into even smaller steps and collects more data and context details.

We are also working on a Profiler App and other tools that could be used to analyze and visualize the collected profiling data.

---

To mention some use-cases on how this setup could be used:

- Here we can compare performance differences between multi-chart setup and a setup that uses SubCharts API.
- We can investigate how to optimally configure data update process considering update interval and data batch size.
- It allows to check how a chart behaves after running updates over a long period of time.
- Or how the chart setup deals with creating and deleting different entities (surfaces/series/etc) in different variations

The automated Playwright tests allow to quickly iterate over configuration variations and present the results in a summary.  
And there are a lot more use-cases for the test setup which we plan to implement.

## Description

This project provides a chart setup that could be configured with different parameters.  
The main app allows to select some parameters of the chart setup via UI controls.  
While the test setup uses a globally exposed function in the client app to initialize a chart.

Also you can generate a report for tests in a form of a table with various performance metrics.

### Project structure

#### Main app

The main app is defined by [webpack.config.ts](./webpack.config.ts), and uses [index.html](./index.html) with [index.ts](./src/index.ts) as an entry file.

#### Test Client App

The test client app is the one that is used as a target in Playwright Tests.
And it is defined by [webpack.test.config.ts](./webpack.test.config.ts), and uses [testIndex.html](./testIndex.html) with [indexForTest.ts](./src/index.ts) as an entry file.  
Notice that those are set up slightly differently from the main app.  
The most important point is that we expose `initExample` function globally on the `window` object.
This function accepts the parameters of a chart configuration.  
Then, we call this function from tests by using `page.evaluate` method.

#### Playwright Testing App

The testing app itself is pretty basic. The main configuration file is [playwright.config.ts](./playwright.config.ts).  
The points to notice in the config are some `launchOptions` flags that we pass to a headless chromium browser and a custom test reporter.

An actual test suite example could be found at [tests/PerformanceTests/nxm.spec.ts](./tests/PerformanceTests/nxm.spec.ts).  
A test uses custom fixture to open the client app page and collect some metrics.  
Then, it evaluates the `initExample` function with a set of parameters.  
And finally it saves the performance metrics into a JSON file.  
That JSON file then can be used to display the collected information in a human friendly format.

#### Test Report App

The Test Report App is an example of formatting the test results generated as a JSON file and displaying them in tables grouped by browser, test suite, and parameters.

The corresponding config is [webpack.reports.config.ts](./webpack.reports.config.ts) and implementation is in [reports/](./reports/).

## Running the project

Here we will show how to run the apps in development mode.

Setup:

!!! Prerequisite: make sure the dependency [Addons](../Addons/package.json) package has its dependencies installed.
`cd ../Addons && npm i && cd ../ProfilingTestSetup`

```bash
npm install
```

### Main App

**Run main app in development mode:**

```bash
npm run dev
```

Opens the main application at `http://localhost:8080` with hot reload.

**Run production mode:**

```bash
npm run build
npm start
```

Builds and serves the production bundle.

### Automated Tests

**Tip**
Use `npm run test:full` to perform full test build and execution in production mode.  
This will:

1. Preserve previous test results (if they exist) by renaming `test-results/results.json` to `test-results-archive/results.previous.json`
2. Build the test bundle with inlined WASM files
3. Run Playwright tests against the self-contained HTML file
4. Generate test results in `test-results/results.json`
5. Backup the previous results to `test-results-archive/results.previous.json` for comparison
6. Generate a test report in [build-reports](./build-reports/) folder.

Otherwise, here is the step by step description:

**Run tests in development mode:**

```bash
npm run test:dev
```

**Run tests against bundled file:**

```bash
npm run build:test
npm test
```

#### Test Results Report

After performing tests, you can open test results report in dev or prod modes.

To run in dev mode use

```bash
npm run dev:reports
```

this will open a page in browser.

Or

```bash
npm run build:reports
```

which will generate the page in [build-reports](./build-reports/) folder.

#### Other options

There are 2 available test modes:

- `url` - targets the Playwright tests to a webpage opened on localhost. The webpage loads JS bundle and WASM files during parsing.
- `file` - targets the Playwright tests to the HTML file that has embedded JS script and WASM files.

These test modes allow to compare the time difference required to fetch and process the app sources.  
Another interesting area to investigate is eager preloading of the resources, e.i. WASM files.

#### Results Location

Test results location is defined by the `outputFile` property passed to [the custom reporter](./reporters/json-reporter.ts).

**Preserve Results Command:**

The `npm test` command automatically runs the `preserve-results` script before building and testing. This script:

- Copies the existing results file to a separate archive location
- Allows the JSON reporter to compare current results with previous results
- Supports custom file paths via environment variables:

```bash
# Custom results and previous file paths
RESULTS_PATH=custom-results/test.json PREVIOUS_PATH=custom-archive/test.previous.json npm test
```

Environment variables:

- `RESULTS_PATH` - Full path to current test results file (default: `test-results/results.json`)
- `PREVIOUS_PATH` - Full path to previous results file (default: `test-results-archive/results.previous.json`)

You can also run the preserve script independently:

```bash
npm run preserve-results
```

This is useful when you want to manually preserve results before running tests multiple times.

**Build test reports with custom previous results file:**

You can specify a custom path to the previous results file when building the reports:

```bash
# Use default previous results location (test-results-previous/results.previous.json)
npm run build:reports

# Use custom previous results file from a different location
PREVIOUS_RESULTS_FILE=test-results-archive/results.previous.json npm run build:reports

# Example: Use results from a specific test run archive
PREVIOUS_RESULTS_FILE=archived-results/2024-11-17/results.previous.json npm run build:reports

# Example: Use results from a different project
PREVIOUS_RESULTS_FILE=../other-project/test-results-previous/results.previous.json npm run build:reports
```

Environment variables for reports build:

- `PREVIOUS_RESULTS_FILE` - Path to the previous results file to include in the report (default: `test-results-previous/results.previous.json`)

## How to use the Main App

The app setup uses `ChartInitializer` class as the main component for controlling a chart lifecycle.  
The ChartInitializer is an aggregation of different APIs grouped in separate modules.  
The API exposes methods for chart setup and data updates configuration.

### Memory Debugging

Before running the example get familiarized with related documentation:
// TODO add link to memory and performance related docs
We recommend testing this example both in a regular manner and by trying to force the garbage collection.
Also, perform testing on a freshly opened tab with incognito mode.

#### Browser Dev-tools

For a demonstration of the example setup and memory usage behaviour follow these steps:

Let's try the standard setup of this demo, leave the inputs in the default state.
Force garbage collection and make a heap snapshot with dev tools.
Press "Create Chart" to initialize a surface.
Force garbage collection and make a heap snapshot again.
The difference in the heap size would consist of SciChart-related objects. Note that a part of the space is allocated for the WASM heap. WASM heap in its turn can also have allocated and free segments.

Press "Append data" to manually add data points to the chart,
or press "Toggle Dynamic Update" to enable/disable the auto update.

After an arbitrary number of updates happened (and dynamic updates are paused),  
press make a memory snapshot again.  
The expected result is no memory usage footprint increase.

#### Memory Usage Tracing

The `ChartInitializer` setup allows capturing the heap size snapshots periodically during the rendering process.  
Use `enableMemoryUsageTracing` option to opt in.  
The collected memory usage data could be displayed in console by pressing the "Log Memory Debug Output" button.

#### Memory Debug Logs

The Memory Debug utils require the app to be run in development mode.  
They allow to track SciChart-related entities that has to be disposed by calling a "delete" method ob them.  
Most of such entities are handled automatically following the ownership rules, and this debugging approach allows to verify that.  
The feature can be enabled by selecting "Memory Debug" checkbox.  
The logs could be displayed in console by pressing the "Log Memory Debug Output" button.

---

Experiment with different params.
Notice that they should be set before a chart is initialized.

### Performance Debugging

#### Performance Debug Logs

Optionally you can enable performance tracing with SciChart's PerformanceDebugHelper API. For this set "Performance Debug" checkbox.
To check the logs ou can output the results to console with "Log Performance Debug Output" along the other logs.
Or alternatively you can export those logs with "Get Data for Profiler" button for investigation in the [Profiler]() App.

#### Performance Metrics Tracing

The `ChartInitializer` setup also can measure top level chart rendering related metrics with minimal overhead.  
It is activated by `enableRenderTracing` option.  
Then, you can output the results to console with "Log Performance Debug Output" along the other logs.

### Setup Customization

If you want to debug a chart setup that exceeds the features of the ChartInitializer configuration,
it is still recommended to use it as a base for structuring your logic.
