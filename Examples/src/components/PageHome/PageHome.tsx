import * as React from "react";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import SeoTags from "../SeoTags/SeoTags";
import { ExampleStrings } from "../Examples/ExampleStrings";
import classes from "./PageHome.module.scss";

import multiPaneStockImg from "../Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/javascript-multi-pane-stock-charts.jpg";
import ImageHeaderComponent from "./ImageHeader/ImageHeaderComponent";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
export const HOME_PAGE_TITLE = "HOMEPAGE";

let prev = 0;
export default function PageHome() {
    const framework = React.useContext(FrameworkContext);
    React.useEffect(() => {
        updateGoogleTagManagerPage();
    }, []);
    return (
        <div className={classes.PageHomeWrapper}>
            <SeoTags
                title={ExampleStrings.siteHomeTitle(FRAMEWORK_NAME[framework])}
                keywords={ExampleStrings.siteKeywords}
                description={ExampleStrings.siteHomeDescription}
                image={ExampleStrings.siteHomeMetaImage}
                url=""
            />
            <div className={classes.PageHomeContent}>
                <div className={classes.PageHomeHeader}>
                    <div className={classes.PageHomeHeaderText}>
                        <h1 className={classes.PageHomeTitle}>SciChart.js Demo</h1>
                        <h3 className={classes.PageHomeAboutText}>
                            The SciChart.js Demo app is where we host our showcases and demos for SciChart's{" "}
                            <a
                                href="https://www.scichart.com/javascript-chart/"
                                target="_blank"
                                title="JavaScript Chart Library"
                            >
                                JavaScript Chart Library
                            </a>
                            . All demos can be viewed at the main SciChart website, over at{" "}
                            <a
                                href="https://www.scichart.com/examples/javascript-chart/"
                                target="_blank"
                                title="JavaScript Chart Examples"
                            >
                                scichart.com/examples/javascript-chart
                            </a>
                        </h3>
                        {/*<div className={classes.ButtonWrapper}>*/}
                        {/*    <Button href="https://www.scichart.com/downloads/" target="_blank">*/}
                        {/*        DOWNLOAD TRIAL*/}
                        {/*    </Button>*/}
                        {/*</div>*/}
                    </div>
                    {/*<div className={classes.PageHomeHeaderImages}>*/}
                    {/*    <div className={classes.Blur}></div>*/}
                    {/*    <div className={classes.PageHomeHeaderImage1}>*/}
                    {/*        <div className={classes.SmallBox}></div>*/}
                    {/*        <img className={classes.PageHomeHeaderImage1} src={multiPaneStockImg} />*/}
                    {/*        <div className={classes.BigBox}></div>*/}
                    {/*    </div>*/}
                    {/*    <ImageHeaderComponent timeOut={1000} interval={5500} className={classes.PageHomeHeaderImage2} />*/}

                    {/*    <ImageHeaderComponent timeOut={1000} interval={6500} className={classes.PageHomeHeaderImage3} />*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}
