# SciChart Chart Export as an image

SciChart uses several presentational HTML element layers.

-   2D / WebGL canvases for most of the drawing
-   HTML layer for specific components (Loader, legend)
-   SVG layer for an appropriate Annotations and adorners

Moreover, users can add their custom HTML and CSS styles which will affect the resulting representation.

So the most reliable way to get an image from the chart is to make a screenshot from the webpage that is being view from.

This example demonstrates how to use the `screenshot` feature in headless browser via [Puppeteer](https://pptr.dev/)

## How it works

We will use the puppeteer browser instance on the NodeJS server.
Considering there is a live page with a chart, we can create a request to export chart chart image from the page by providing a URL of the website.

Then, on the server, we startup the headless browser instance, navigate to the provided URL and search for the target HTML element and call `screenshot` for it.
Then the resulting data could be sent back to client.

## Running the demo

```
npm install
npm run build
npm start
```
