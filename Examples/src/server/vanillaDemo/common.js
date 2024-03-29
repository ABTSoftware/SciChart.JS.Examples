import { SciChartSurface, SciChart3DSurface, SciChartDefaults } from "./scichart.browser.mjs";

SciChartSurface.configure({ dataUrl: "/scichart2d.data", wasmUrl: "/scichart2d.wasm" });
SciChart3DSurface.configure({ dataUrl: "/scichart3d.data", wasmUrl: "/scichart3d.wasm" });
SciChartDefaults.performanceWarnings = false;
// if (window.location.hostname.includes("scichart")) {
//     // TODO
//     // SciChart.SciChartSurface.setRuntimeLicenseKey(
//     //     "k+sB7T86MNUScrzB3XxJvoeaW3Pauy+pfhiEaISfj+d5yTv5SqI5AeIF54RA+Th/d9alXJq46HY+vmRDtCQJsSV90nQrqsL3CDjSLyadSj5N+DcPIi1MSsEcLrksK9bLr93J3hWCXJesurwTATgNEsXHlV6WI9KQfFLIhotDphx5O8NQKRfA82VEcbRGWOHTP/uMvz0ciMOMJJOF7OvMbd3EK6IuVhWtHvoENTa9RAd/5PriF9y6OzBtJg1u1uMlc/11LoGK6vGMBaahVBYjfWWGYAOpg00F5rLfHTY1ocf0/A6ImNA5xWZqiKwFbxfQJ/nh7phwcwIYLVFNU6QXZQyonwAynzgLTtwtg3HPegrYcIgfwrqony4OXNWWrnZuMV37U/NDAab6rZ499LlYsUqBTL6tJcO9mz/8MQYj0GUXuWajDudyvHRtoZwz6khit4JZR2pn9hSzgD0e3klL45o5BBQLJONgscByY6p8kYk3/oupGB9IF0IJwJtM7C8Wb1pb5E2UbulwuNzz7ct9OTaKt5t6jVn20VW25bjpcyWyJwN3E2fSuE5e9XU0ScVldxYo7VwF8Tcu4PJEAwQPzivvGGhtarUjfRQho10RbWK8p1jTHjHanA3DAdxUttUTvfzF/O8BbeBYrH3bDcY4tRdH/2px7K/FP6ITkZAtilimvmctWKbhXLyAiHIMsNDp2OtyJ/nM8XOB9hyWCPXfabHP7TD+gTkJMAK5Pw8dMC0lNdnwwjvBlz5Ho8APkr61NLa4FpVMFcBntTRgfjPJGMg="
//     // );
// }
