import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { libraryVersion } from "scichart";

export default function AppFooter() {
    return (
        <>
            <div className="sc-app-footer">
                <div className="sc-app-footer-footer-bottom-section">
                    <div className="sc-app-footer-links-box">
                        <h5>Frameworks</h5>
                        <div className="sc-app-footer-divider">
                            <div className="sc-app-footer-divider-box"></div>
                        </div>
                        <div className="sc-app-footer-related-links">
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
                    <div className="sc-app-footer-links-box">
                        <h5>Quick links</h5>
                        <div className="sc-app-footer-divider">
                            <div className="sc-app-footer-divider-box"></div>
                        </div>
                        <div className="sc-app-footer-related-links">
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
                                SciChart blog
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
                    <div className="sc-app-footer-links-box">
                        <h5>Useful links</h5>
                        <div className="sc-app-footer-divider">
                            <div className="sc-app-footer-divider-box"></div>
                        </div>
                        <div className="sc-app-footer-related-links">
                            <a href="https://www.scichart.com/changelog/scichart-js/" title="Changelog">
                                View v{libraryVersion} Changelog
                            </a>
                            <a href="https://www.scichart.com/downloads/" title="Download free trials">
                                Download free trials
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
                    <div className="sc-app-footer-links-box">
                        <h5>Contact us</h5>
                        <div className="sc-app-footer-divider">
                            <div className="sc-app-footer-divider-box"></div>
                        </div>
                        <p>Not sure where to start? Contact us, we are happy to help!</p>
                        <a
                            className="sc-button sc-app-footer-contact-us-button"
                            href="https://www.scichart.com/contact-us/"
                            target="_blank"
                        >
                            Contact us
                        </a>
                        <div className="sc-app-footer-social-media-links">
                            <a
                                className="sc-button sc-button-icon"
                                href="https://www.facebook.com/scichart"
                                title="SciChart on Facebook"
                            >
                                <FacebookIcon />
                            </a>
                            <a
                                className="sc-button sc-button-icon"
                                href="https://www.youtube.com/user/SciChart"
                                title="SciChart on YouTube"
                            >
                                <YouTubeIcon />
                            </a>
                            <a
                                className="sc-button sc-button-icon"
                                href="https://www.linkedin.com/company/scichart"
                                title="SciChart on LinkedIn"
                            >
                                <LinkedInIcon />
                            </a>
                            <a
                                className="sc-button sc-button-icon"
                                href="https://twitter.com/scichart"
                                title="SciChart on Twitter"
                            >
                                <TwitterIcon />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sc-app-footer-copyright">
                <span>SciChart Ltd, 16 Beaufort Court, Admirals Way, Docklands, London, E14 9XL.</span>
            </div>
        </>
    );
}
