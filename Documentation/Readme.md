# SciChart Documentation Snippets

This folder contains all the code referenced in the SciChart.JS documentation at (https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html)

documentx contains the source the the content of the documentation.  There's nothing useful to anyone outside scichart in there - browse the actual documentation instead.

The snippets themselves live in the src folder.

## Build and run
```
npm install
npm run build
npm start
```

## Options
nav=0 to show full screen.
embed=1 to show a codepen embed.  height=500 to control the height of the embed.
codepen=1 to redirect to codepen

## Adding a snippet
1. Add a folder containing a demo.js file.
2. Run `npm run gen` which will generate the html, css and details files.  If you edit these files, they will not be overwritten.
3. Restart the server to pick up changes to the navigation html