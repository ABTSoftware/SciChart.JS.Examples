import * as React from "react";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D,
    MENU_ITEMS_3D_ID,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_FEATURED_APPS_ID
} from "../AppRouter/examples";
import FooterGrid from "./FooterGrid";
import { useHistory } from "react-router-dom";
import classes from "./AppFooter.module.scss";
import Box from "../../helpers/shared/Helpers/Box/Box";
import FacebookIcon from '@material-ui/icons/Facebook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import Button from "@material-ui/core/Button";

export type TFooterlink = {
    link: string;
    text: string;
};

export default function AppFooter() {
    const history = useHistory();

    const historyPushPath = (path: string) => {
        if (!path) return;
        history.push(path);
    };

    return (
        <>
            <div className={classes.AppFooter}>
                <FooterGrid
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
                <div className={classes.FooterBottomSection}>
                    <FooterGrid
                        historyPushPath={historyPushPath}
                        title="3D Charts"
                        menuItems={MENU_ITEMS_3D}
                        menuItemsId={MENU_ITEMS_3D_ID}
                    />
                    <div className={classes.LinksBox}>
                        <h5>Quick Links</h5>
                        <div className={classes.divider}>
                            <div className={classes.dividerBox}></div>
                        </div>
                        <div className={classes.RelatedLinks}>
                            <a href="https://www.scichart.com/" title="Home Page" aria-current="page">
                                Home
                            </a>
                            <a href="https://www.scichart.com/wpf-chart-features" title="WPF Charts">
                                WPF Charts
                            </a>
                            <a href="https://www.scichart.com/wpf-3d-chart-features" title="WPF 3D Charts">
                                WPF 3D Charts
                            </a>
                            <a href="https://www.scichart.com/ios-chart-features" title="iOS &amp; macOS Charts">
                                iOS &amp; macOS Charts
                            </a>
                            <a href="https://www.scichart.com/android-chart-features" title="Android Charts">
                                Android Charts
                            </a>
                            <a href="https://www.scichart.com/javascript-chart-features/" title="JavaScript Charts">
                                JavaScript Charts
                            </a>
                            <a href="https://store.scichart.com" title="Pricing">
                                Pricing
                            </a>
                            <a href="https://www.scichart.com/news/" title="News">
                                News
                            </a>
                            <a href="https://blog.scichart.com" title="SciChart Blog">
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
                            <a href="https://www.scichart.com/downloads" title="Download FREE Trials">
                                Download FREE Trials
                            </a>
                            <a href="http://try.scichart.com/wpf-charts-trial/clkn/https/www.scichart.com/documentation/v4.x/webframe.html#Installing%20and%20Uninstalling%20SciChart.html">
                                Installing and Uninstalling SciChart WPF
                            </a>
                            <a href="https://www.scichart.com/read-testimonials/" title="Testimonials &amp; Reviews">
                                Testimonials &amp; Reviews
                            </a>
                            <a href="http://support.scichart.com/" title="Community &amp; Support">
                                Community &amp; Support
                            </a>
                            <a href="https://www.scichart.com/wpf-chart-examples" title="WPF Chart Examples">
                                WPF Chart Examples
                            </a>
                            <a
                                href="https://www.scichart.com/ios-chart-examples"
                                title="iOS &amp; macOS Chart Examples"
                            >
                                iOS &amp; macOS Chart Examples
                            </a>
                            <a href="https://www.scichart.com/android-chart-examples" title="Android Chart Examples">
                                Android Chart Examples
                            </a>
                            <a href="https://demo.scichart.com" title="JavaScript Chart Examples">
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
                <span>
                    SciChart Ltd, 16 Beaufort Court, Admirals Way, Docklands, London, E14 9XL.
                </span>
            </div>
        </>
    );
}
