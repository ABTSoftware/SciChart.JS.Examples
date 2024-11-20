import React from "react";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import SeoTags from "../SeoTags/SeoTags";
import { ExampleStrings } from "../Examples/ExampleStrings";
import classes from "./PageHome.module.scss";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import { FrameworkSelect } from "../AppDeatilsRouters/FrameworkSelect";

export const HOME_PAGE_TITLE = "HOMEPAGE";

export default function PageHome() {
    const framework = React.useContext(FrameworkContext);

    React.useEffect(() => {
        updateGoogleTagManagerPage();
    }, []);

    return (
        <>
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
                                    href="https://www.scichart.com/javascript-chart-features/"
                                    target="_blank"
                                    title="JavaScript Chart Library"
                                >
                                    JavaScript Chart Library
                                </a>
                            </h3>
                        </div>
                        <div className="VideoContainer" style={{ marginLeft: "auto" }}>
                            <iframe
                                className={classes.BannerVideo}
                                style={{ height: "160px", aspectRatio: "16/9", borderRadius: "8px" }}
                                src="https://www.youtube.com/embed/1pxjvy_Yaik?autoplay=1&mute=1&loop=1&playlist=1pxjvy_Yaik"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
