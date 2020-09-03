export function renderIndexHtml(html: string, css: string) {
    return `
    <!DOCTYPE html>
    <html lang="en-us">
        <head>
            <meta charset="utf-8" />
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>SciChart Web Demo</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/themes/prism-okaidia.min.css" rel="stylesheet" />
            <style id="jss-server-side">${css}</style>
            <script async type="text/javascript" src="bundle.js"></script>
        </head>
        <body>
            <div id="react-root">${html}</div>
        </body>
    </html>
  `;
}
