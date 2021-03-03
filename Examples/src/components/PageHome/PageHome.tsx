import Button from "@material-ui/core/Button";
import * as React from "react";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import SeoTags from "../SeoTags/SeoTags";
import { ExampleStrings } from "../Examples/ExampleStrings";
import classes from "./PageHome.module.scss";

import multiPaneStockImg from "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
import ImageHeaderComponent from "./ImageHeader/ImageHeaderComponent";
export const HOME_PAGE_TITLE = "HOMEPAGE";

let prev = 0;
export default function PageHome() {
    React.useEffect(() => {
        updateGoogleTagManagerPage();
    }, []);
    return (
        <div className={classes.PageHomeWrapper}>
            <SeoTags
                title={ExampleStrings.siteHomeTitle}
                keywords={ExampleStrings.siteKeywords}
                description={ExampleStrings.siteHomeDescription}
                image={ExampleStrings.siteHomeMetaImage}
                url=""
            />
            <div className={classes.PageHomeContent}>
                <div className={classes.PageHomeHeader}>
                    <div className={classes.PageHomeHeaderText}>
                        <h1 className={classes.PageHomeTitle}>
                            High Performance
                            <span>Realtime Javascript Charts</span>
                        </h1>
                        <h3 className={classes.PageHomeAboutText}>
                            With our cutting-edge, award-winning graphics engine in WebAssembly & WebGL, SciChart.js
                            brings you the world's fastest JavaScript Chart Component. Plot millions of data-points in
                            realtime, create next-generation streaming, updating financial, medical, scientific and
                            big-data business applications.
                        </h3>
                        <div
                            className={classes.ButtonWrapper}
                            // style={{ marginTop: 30 }}
                            // size="large"
                            // color="primary"
                            // aria-label="small outlined button group"
                        >
                            <Button href="https://www.scichart.com/downloads/" target="_blank">
                                DOWNLOAD TRIAL
                            </Button>
                        </div>
                        {/* <div style={{ textAlign: "center" }}>
                            <img src={sciChartLogoImg} width={300} />
                        </div> */}
                    </div>
                    <div className={classes.PageHomeHeaderImages}>
                        <div className={classes.Blur}></div>
                        <div className={classes.PageHomeHeaderImage1}>
                            <div className={classes.SmallBox}></div>
                            <img className={classes.PageHomeHeaderImage1} src={multiPaneStockImg} />
                            <div className={classes.BigBox}></div>
                        </div>
                        <ImageHeaderComponent timeOut={1000} interval={5500} className={classes.PageHomeHeaderImage2} />

                        <ImageHeaderComponent timeOut={1000} interval={6500} className={classes.PageHomeHeaderImage3} />
                    </div>
                </div>
            </div>
        </div>
    );
}
