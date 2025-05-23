import { HelmetData } from "react-helmet";
import { baseAppPath } from "../constants";

export function renderIndexHtml(html: string, css: string, helmet: HelmetData) {
    return `
    <!DOCTYPE html>
    <html lang="en-us" ${helmet.htmlAttributes.toString()}>
        <head>
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-M8FXVD7');</script>
            <!-- End Google Tag Manager -->
            <base href="${baseAppPath}/">
            <meta charset="utf-8">
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta property="og:type" content="website">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:site" content="@scichart">
            ${helmet.title.toString()}
            ${helmet.meta.toString()}

            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link rel="preload" href="https://fonts.gstatic.com/s/montserrat/v29/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2" as="font" type="font/woff2" crossorigin>
            <link rel="preload" href="https://fonts.gstatic.com/s/montserrat/v29/JTUQjIg1_i6t8kCHKm459WxRyS7m.woff2" as="font" type="font/woff2" crossorigin>

            <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,400;0,600;0,700;1,100;1,400;1,600;1,700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <!--
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/themes/prism-okaidia.min.css" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/plugins/line-numbers/prism-line-numbers.min.css" />
            -->
            <link rel="stylesheet" href="style.css" />

            <meta name="emotion-insertion-point" content="" />
            ${css}

            <script async fetchpriority="high" type="text/javascript" src="bundle.js"></script>
            <link rel="preload" href="scichart2d.wasm" as="fetch" crossorigin="anonymous" />
            <link rel="preload" href="scichart2d.data" as="fetch" crossorigin="anonymous" />
            <link rel="preload" href="scichart3d.wasm" as="fetch" crossorigin="anonymous" />
            <link rel="preload" href="scichart3d.data" as="fetch" crossorigin="anonymous" />
        </head>
        <body ${helmet.bodyAttributes.toString()} style="margin: 0;">
            <!-- Display a message if JS has been disabled on the browser. -->
            <noscript>If you're seeing this message, that means
                <strong>JavaScript has been disabled on your browser</strong>, please
                <strong>enable JS</strong> to make this app work.</noscript>

            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M8FXVD7"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->

            <!-- App -->
            <div id="react-root">${html}</div>

            <!-- 
            <script>
                window.Prism = window.Prism || {};
                Prism.manual = true;
            </script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/prism.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.21.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
            -->

            <!-- Activecampaign -->
            <script type="text/javascript">
                (function (e, t, o, n, p, r, i) { e.visitorGlobalObjectAlias = n; e[e.visitorGlobalObjectAlias] = e[e.visitorGlobalObjectAlias] || function () { (e[e.visitorGlobalObjectAlias].q = e[e.visitorGlobalObjectAlias].q || []).push(arguments) }; e[e.visitorGlobalObjectAlias].l = (new Date).getTime(); r = t.createElement("script"); r.src = o; r.async = true; i = t.getElementsByTagName("script")[0]; i.parentNode.insertBefore(r, i) })(window, document, "https://diffuser-cdn.app-us1.com/diffuser/diffuser.js", "vgo");
                vgo('setAccount', '65948542');
                vgo('setTrackByDefault', true);

                vgo('process');
            </script>

              <!-- Hotjar Tracking Code for www.scichart.com -->
              <script>
                (function (h, o, t, j, a, r) {
                  h.hj =
                    h.hj ||
                    function () {
                      (h.hj.q = h.hj.q || []).push(arguments);
                    };
                  h._hjSettings = { hjid: 1333176, hjsv: 6 };
                  a = o.getElementsByTagName('head')[0];
                  r = o.createElement('script');
                  r.async = 1;
                  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
              </script>
        </body>
    </html>
  `;
}
