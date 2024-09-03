import React from "react";
import classes from "./AppNewRouter.scss";
import Chart from "../NewTabs/images/chart-d.jpg";

const DetailsCom = () => {
    return (
        <div className={classes.scichartcontainer}>
            <div className={classes.scichartinfo}>
                <p>
                    SciChart.js ships with over 80 <a href="#">JavaScript Chart demos</a> which you can browse, view the
                    source code and see related documentation. Build incredible complex dashboards with SciChart.js, our
                    High Performance <a href="#">JavaScript Chart Library</a>.
                </p>
                <button className={classes.gettingstartedbtn}>Getting Started</button>
            </div>
            <div className={classes.scichartdescription}>
                <p>
                    This <a href="#">JavaScript Chart</a> demo shows you how to create a JavaScript Candlestick Chart or
                    Stock Chart using SciChart.js. SciChart.js supports Candlestick Charts with custom colors per bar
                    and a Date X-Axis. Candlestick charts can be animated, dynamically updated for real trading apps or
                    combined with other series types to draw technical indicators or shapes.
                </p>
                <p>
                    By signing up with SciChart.js, you’ll have access to over 80 chart examples, including customizable
                    financial charts. Compared to other chart software vendors, our samples have more sophisticated
                    features, all with simple to understand instructions and documentation. Your developers can also
                    benefit from our responsive support team.
                </p>
            </div>
            <div className={classes.documentationlinkscontainer}>
                <h3>Documentation Links</h3>
                <div className={classes.documentationlinks}>
                    <a href="#">SciChart.js Documentation Home</a>
                    <a href="#">JavaScript Candlestick Chart Documentation</a>
                    <a href="#">SciChart.js Tutorials</a>
                    <a href="#">Common RenderableSeries Properties</a>
                </div>
            </div>
            <div className={classes.candlestickchartscontainer}>
                <h2>Candlestick Charts for traders</h2>
                <p>
                    The most popular <a href="#">chart type for traders</a> is the candlestick chart. Candlestick
                    provides visual support for making decisions in the case of stocks, foreign exchange or commodities.
                </p>
                <p>
                    Sometimes, in trading, you are not able to see the volume of data you require. With SciChart.js,
                    there are fewer limitations – for instance, you can visualize a year’s worth of 1-minute OHLC bars
                    in a Candlestick Chart, as opposed to a few days. We help you present even the most complex data
                    sets in a way that’s easy to navigate and understand, all with high performance.
                </p>
                <p>
                    Our candlestick graphs support interactive elements including animation, zooming and panning. Our
                    boilerplates integrate easily with all your JavaScript frameworks, including Angular, Vue, Blazor,
                    React, Electron and Next.js. Start creating more sophisticated financial charts to describe the
                    price changes of a security or currency with SciChart.js. Ready to create your JavaScript
                    Candlestick Chart?
                </p>
                <p>
                    SciChart.js is the latest software to be added to our award-winning chart library portfolio. Our
                    priority is to enable the creation of high-performance JavaScript charts for all your digital
                    applications. To use locally, simply sign-up and follow the steps. Create complex, fast-rendering
                    financial charts in just a few steps!
                </p>
                <h3>
                    Our dedicated <a href="#">SciChart.js Getting Started guide</a> has all the information you need to:
                </h3>
                <ul>
                    <li>Start for free with our community edition.</li>
                    <li>
                        Access step-by-step code JavaScript Candlestick Chart samples to create charts with NPM and
                        Webpack.
                    </li>
                    <li>Access over 80 chart examples and customizable features with our examples app.</li>
                    <li>Get building your first charting app with our tutorials.</li>
                </ul>
            </div>
            <div className={classes.whyusescichart}>
                <h3>Why Use SciChart JavaScript Chart Library?</h3>
                <div className={classes.benefits}>
                    <ul>
                        <li>Supports millions of data points</li>
                        <li>Fast rendering for real-time data feeds</li>
                        <li>Supports customizable, interactive features</li>
                    </ul>
                    <ul>
                        <li>5-star rated support for developers</li>
                        <li>Winner of Queen’s Award for Innovation</li>
                    </ul>
                </div>
            </div>
            <div className={classes.Questions}>
                <h2>Frequently Asked Questions</h2>
                <div className={classes.QuestionsBack}>
                    <h3>Are your JavaScript Candlestick Charts responsive?</h3>
                    <p>
                        Yes – all our JavaScript charts offer cross-browser and device compatibility. This means they
                        will automatically appear in the right format no matter what browser or device your web
                        application viewers are using.
                    </p>
                </div>
            </div>
            <div className={classes.newblockcontainer}>
                <div className={classes.imagecontainer}>
                    <img src={Chart} alt="Description of Image" />
                </div>
                <div className={classes.buttoncontainer}>
                    <h3>Documentaion link</h3>
                    <button>SciChart.js Documentation Home</button>
                    <button>SciChart.js Tutorials</button>
                    <button>JavaScript Candlestick Chart Documentation</button>
                    <button>JavaScript OHLC Chart Documentation</button>
                </div>
            </div>
            <div className={classes.codecardscontainer}>
                <div className={classes.codecard}>
                    <img src={Chart} alt="Repo Image" />
                    <h4>CandlestickChart/index.tsx</h4>
                    <button className={classes.viewsourcebutton}>View Source Code</button>
                </div>
                <div className={classes.codecard}>
                    <img src={Chart} alt="Repo Image" />
                    <h4>CandlestickChart/data/binanceRestClient.ts</h4>
                    <button className={classes.viewsourcebutton}>View Source Code</button>
                </div>
            </div>
        </div>
    );
};

export default DetailsCom;
