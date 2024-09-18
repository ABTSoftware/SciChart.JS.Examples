import React, { useState, FC, useContext, useMemo, useEffect } from "react";
import classes from "./AppDeatilsRouter.scss";
import Chart from "../TopBarTabs/images/chart-d.jpg";
import { TExamplePage } from "../AppRouter/examplePages";

type TProps = {
    currentExample: TExamplePage;
};

const DetailsCom: FC<TProps> = (props) => {
    const { currentExample } = props;
    return (
        <div className={classes.scichartcontainer}>
            <div className={classes.scichartinfo}>
                <p
                    style={{ fontSize: "20px", fontFamily: "Arial" }}
                    dangerouslySetInnerHTML={{ __html: currentExample.customDescription }}
                />
                <button className={classes.gettingstartedbtn}>Getting Started</button>
            </div>
            <div className={classes.scichartdescription}>
                <p
                    style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: 500, marginTop: "30px" }}
                    dangerouslySetInnerHTML={{ __html: currentExample.customDescription1 }}
                />
            </div>
            <div className={classes.documentationlinkscontainer}>
                <h3>Documentation Links</h3>
                <div className={classes.documentationlinks}>
                    {currentExample.NewLinks.map((link, index) => (
                        <a key={index} href={link.url}>
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
            <div className={classes.candlestickchartscontainer}>
                <h2>Candlestick Charts for traders</h2>
                <p
                    style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: 500, marginTop: "30px" }}
                    dangerouslySetInnerHTML={{ __html: currentExample.moreInfo }}
                />
                <h3>
                    Our dedicated <a href="#">SciChart.js Getting Started guide</a> has all the information you need to:
                </h3>
                <ul>
                    {currentExample.NewPoints.map((link, index) => (
                        <li style={{ fontSize: "20px", fontFamily: "Popins", fontWeight: 500 }} key={index}>
                            {link.label}
                        </li>
                    ))}
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
                    {currentExample.Questions.map((link, index) => (
                        <>
                            <h3>{link.label}</h3>
                            <p style={{ fontFamily: "Arial" }}>{link.tag}</p>
                        </>
                    ))}
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
