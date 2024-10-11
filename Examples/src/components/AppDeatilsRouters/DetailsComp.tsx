import React, { useState, FC, useContext, useMemo, useEffect } from "react";
import classes from "./AppDeatilsRouter.scss";
import Chart from "../TopBarTabs/images/chart-d.jpg";
import { TExamplePage } from "../AppRouter/examplePages";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { PluggableList } from "react-markdown/lib/react-markdown";

type TProps = {
    currentExample: TExamplePage;
};

const plugins: PluggableList = [rehypeRaw as any];

const DetailsCom: FC<TProps> = (props) => {
    const { currentExample } = props;
    return (
        <div className={classes.scichartcontainer}>

            {currentExample?.markdownContent?.length && 
                <ReactMarkdown rehypePlugins={plugins}>
                    {currentExample.markdownContent}
                </ReactMarkdown>
            }

            {currentExample.customDescription && (
                <div className={classes.scichartinfo}>
                    <p
                        style={{ fontSize: "20px", fontFamily: "Arial" }}
                        dangerouslySetInnerHTML={{ __html: currentExample.customDescription }}
                    />
                    <button className={classes.gettingstartedbtn}>Getting Started</button>
                </div>
            )}
            {currentExample.customDescription1 && (
                <div className={classes.scichartdescription}>
                    <p
                        style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: 500, marginTop: "30px" }}
                        dangerouslySetInnerHTML={{ __html: currentExample.customDescription1 }}
                    />
                </div>
            )}
            {currentExample?.NewLinks?.length > 0 && (
                <div className={classes.documentationlinkscontainer}>
                    <h3>{currentExample.customheader}</h3>
                    <div className={classes.documentationlinks}>
                        {currentExample.NewLinks.map((link, index) => (
                            <a key={index} href={link.url}>
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            {currentExample?.moreInfo?.length > 0 && (
                <div className={classes.candlestickchartscontainer}>
                    <h2>{currentExample.moreInfoHeader}</h2>
                    {currentExample.moreInfo.map((item, index) => (
                        <p
                            key={index}
                            style={{ fontSize: "20px", fontFamily: "Arial", fontWeight: 500, marginTop: "30px" }}
                        >
                            {item.label}
                        </p>
                    ))}
                    <h3>
                        Our dedicated <a href="#">SciChart.js Getting Started guide</a> has all the information you need
                        to:
                    </h3>
                    <ul>
                        {currentExample.NewPoints.map((link, index) => (
                            <li style={{ fontSize: "20px", fontFamily: "Popins", fontWeight: 500 }} key={index}>
                                {link.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {currentExample?.Benifits?.length > 0 && (
                <div className={classes.whyusescichart}>
                    <h3>{currentExample.BenifitsHeader}</h3>
                    <div className={classes.benefits}>
                        {currentExample.Benifits.map((item, index) => (
                            <ul key={index}>
                                <li>{item.label}</li>
                            </ul>
                        ))}
                    </div>
                </div>
            )}
            {currentExample?.Questions?.length > 0 && (
                <div className={classes.Questions}>
                    <h2>{currentExample.QuestionsHeader}</h2>
                    <div className={classes.QuestionsBack}>
                        {currentExample.Questions.map((link, index) => (
                            <>
                                <h3>{link.label}</h3>
                                <p style={{ fontFamily: "Arial" }}>{link.tag}</p>
                            </>
                        ))}
                    </div>
                </div>
            )}

            <div className={classes.newblockcontainer}>
                <div className={classes.imagecontainer}>
                    <img src={currentExample.thumbnailImage} alt="Description of Image" />
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
