import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import sciChartLogoImg from "../../images/scichart_logo_2.png";
import Gallery from "../Gallery/Gallery";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import SeoTags from "../SeoTags/SeoTags";
import { ExampleStrings } from "../Examples/ExampleStrings";
import classes from "./PageHome.module.scss";

export const HOME_PAGE_TITLE = "HOMEPAGE";

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
                    <div>
                        <h1 className={classes.PageHomeTitle}>SciChart.js</h1>
                        <h2 className={classes.PageHomeSubTitle}>High Performance Realtime Javascript Charts</h2>
                        <div style={{ textAlign: "center" }}>
                            <img src={sciChartLogoImg} width={300} />
                        </div>
                    </div>
                    <div className={classes.PageHomeHeaderText}>
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
                            {/* TODO remove button component */}
                            <Button href="https://www.scichart.com/downloads/" target="_blank">
                                DOWNLOAD TRIAL
                            </Button>
                        </div>
                    </div>
                </div>
                <Gallery />
            </div>
        </div>
    );
}
