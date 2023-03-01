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
embed=1 to show a codepen embed.
codepen=1 to redirect to codepen.
builder=1 to call the builderExample function.

## Adding a snippet
1. Add a folder containing a demo.js file.
2. Run `npm run gen` which will generate the html, css and details files.  If you edit these files, they will not be overwritten.
3. Restart the server to pick up changes to the navigation html
4. If adding a typescript example, call it demo.ts.  import { whatever } from 'scichart' as normal.  You must do `npm run build` for it to work.

## Builder Api support
Add the builder api version within the demo.js.  The function must be call builderExample.
Add the following at the end of the file.
```if (location.search.includes("builder=1")) 
builderExample("scichart-root");
```