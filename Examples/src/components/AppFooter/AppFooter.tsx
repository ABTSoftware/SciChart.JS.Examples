import * as React from "react";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D,
    MENU_ITEMS_3D_ID,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_FEATURED_APPS_ID,
} from "../AppRouter/examples";
import FooterGrid from "./FooterGrid";
import { useNavigate } from "react-router";
import classes from "./AppFooter.module.scss";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import Button from "@mui/material/Button";
import { libraryVersion } from "scichart";

export type TFooterlink = {
    link: string;
    text: string;
};

export default function AppFooter() {
    const navigate = useNavigate();

    const historyPushPath = (path: string) => {
        if (!path) return;
        navigate(path);
    };

    return (
        <>
            <div className={classes.AppFooter}>
                {/* // removing this section from the footer  */}
                {/* <FooterGrid
                    historyPushPath={historyPushPath}
                    title="Featured Apps"
                    menuItems={MENU_ITEMS_FEATURED_APPS}
                    menuItemsId={MENU_ITEMS_FEATURED_APPS_ID}
                />
                <FooterGrid
                    historyPushPath={historyPushPath}
                    title="2D Charts"
                    menuItems={MENU_ITEMS_2D}
                    menuItemsId={MENU_ITEMS_2D_ID}
                />
                <FooterGrid
                    historyPushPath={historyPushPath}
                    title="3D Charts"
                    menuItems={MENU_ITEMS_3D}
                    menuItemsId={MENU_ITEMS_3D_ID}
                /> */}
                <div className={classes.FooterBottomSection}>
                    <div className={classes.LinksBox}>
                        <h5>Frameworks</h5>
                        <div className={classes.divider}>
                            <div className={classes.dividerBox}></div>
                        </div>
                        <div className={classes.RelatedLinks}>
                            <a href="https://www.scichart.com/demo/javascript" title="SciChart Javascript Demos">
                                SciChart Javascript Demos
                            </a>
                            <a href="https://www.scichart.com/demo/react" title="SciChart React Demos">
                                SciChart React Demos
                            </a>
                            <a href="https://www.scichart.com/demo/angular" title="SciChart Angular Demos">
                                SciChart Angular Demos
                            </a>
                        </div>
                    </div>
                    <div className={classes.LinksBox}>
                        <h5>Quick Links</h5>
                        <div className={classes.divider}>
                            <div className={classes.dividerBox}></div>
                        </div>
                        <div className={classes.RelatedLinks}>
                            <a href="https://www.scichart.com/" title="Home Page" aria-current="page">
                                Home
                            </a>
                            <a href="https://www.scichart.com/wpf-chart-features/" title="WPF Charts">
                                WPF Charts
                            </a>
                            <a href="https://www.scichart.com/wpf-3d-chart-features/" title="WPF 3D Charts">
                                WPF 3D Charts
                            </a>
                            <a href="https://www.scichart.com/ios-chart-features/" title="iOS &amp; macOS Charts">
                                iOS &amp; macOS Charts
                            </a>
                            <a href="https://www.scichart.com/android-chart-features/" title="Android Charts">
                                Android Charts
                            </a>
                            <a href="https://www.scichart.com/javascript-chart-features/" title="JavaScript Charts">
                                JavaScript Charts
                            </a>
                            <a href="https://www.scichart.com/shop/" title="Pricing">
                                Pricing
                            </a>
                            <a href="https://www.scichart.com/news/" title="News">
                                News &amp; Releases
                            </a>
                            <a href="https://www.scichart.com/blog/" title="SciChart Blog">
                                NEW! SciChart Blog
                            </a>
                            <a href="https://www.scichart.com/about-us/" title="About Us">
                                About Us
                            </a>
                            <a href="https://www.scichart.com/scichart-eula/" title="EULA">
                                EULA
                            </a>
                            <a title="Sitemap" href="/sitemap.xml">
                                Sitemap
                            </a>
                        </div>
                    </div>
                    <div className={classes.LinksBox}>
                        <h5>Useful Links</h5>
                        <div className={classes.divider}>
                            <div className={classes.dividerBox}></div>
                        </div>
                        <div className={classes.RelatedLinks}>
                            <a href="https://www.scichart.com/changelog/scichart-js/" title="Changelog">
                                View v{libraryVersion} Changelog
                            </a>
                            <a href="https://www.scichart.com/downloads/" title="Download FREE Trials">
                                Download FREE Trials
                            </a>
                            <a href="https://www.scichart.com/read-testimonials/" title="Testimonials &amp; Reviews">
                                Testimonials &amp; Reviews
                            </a>
                            <a href="https://support.scichart.com/support/home" title="Community &amp; Support">
                                Community &amp; Support
                            </a>
                            <a href="https://www.scichart.com/examples/wpf-chart/" title="WPF Chart Examples">
                                WPF Chart Examples
                            </a>
                            <a
                                href="https://www.scichart.com/examples/ios-chart/"
                                title="iOS &amp; macOS Chart Examples"
                            >
                                iOS &amp; macOS Chart Examples
                            </a>
                            <a href="https://www.scichart.com/examples/android-chart/" title="Android Chart Examples">
                                Android Chart Examples
                            </a>
                            <a href="https://www.scichart.com/demo" title="JavaScript Chart Examples">
                                JavaScript Chart Examples
                            </a>
                        </div>
                    </div>
                    <div className={classes.LinksBox}>
                        <h5>Contact us</h5>
                        <div className={classes.divider}>
                            <div className={classes.dividerBox}></div>
                        </div>
                        <p>Not sure where to start? Contact us, we are happy to help!</p>
                        <Button
                            className={classes.ContactUsButton}
                            href="https://www.scichart.com/contact-us/"
                            target="_blank"
                        >
                            Contact Us
                        </Button>
                        <div className={classes.SocialMediaLinks}>
                            <a href="https://www.facebook.com/scichart" title="SciChart on Facebook">
                                <FacebookIcon fontSize="large" />
                            </a>
                            <a href="https://www.youtube.com/user/SciChart" title="SciChart on YouTube">
                                <YouTubeIcon fontSize="large" />
                            </a>
                            <a href="https://www.linkedin.com/company/scichart" title="SciChart on LinkedIn">
                                <LinkedInIcon fontSize="large" />
                            </a>
                            <a href="https://twitter.com/scichart" title="SciChart on Twitter">
                                <TwitterIcon fontSize="large" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.Copyright}>
                <span>SciChart Ltd, 16 Beaufort Court, Admirals Way, Docklands, London, E14 9XL.</span>
            </div>
        </>
    );
}
