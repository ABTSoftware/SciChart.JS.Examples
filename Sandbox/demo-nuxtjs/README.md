
# Nuxt.js Scichart Demo

### Demo created with browser bundle since there is no support of WebAssembly from Nuxt side

## Scripts Injecting

### To Make SciChart Class available object the Nuxt should include BrowserBundle (compiled JS code from CDN)
### script section of nuxt.config.js:
```
script: [
    {
        src: "https://cdn.jsdelivr.net/npm/scichart@2.0.2146/_wasm/scichart.browser.js",
    },
]
```

## Project setup
### install dependencies
```
npm install
```

### serve with hot reload at localhost:3000
```
npm run dev
```

### build for production and launch server
```
npm run build
npm start
```
