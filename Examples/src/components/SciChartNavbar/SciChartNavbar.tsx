import { Button } from "@mui/material";
import { ETheme } from "../../helpers/types/types";
import MenuIcon from "@mui/icons-material/Menu";
import "./styles.css";
import { useEffect, useState } from "react";

// for testing only - to see logged in UI
// document.cookie = "wordpress_logged_in_=true;expires=Thu,18Dec2023-12:00:00UTC;path=/";

export default function SciChartNavbar({
    toggleDrawer,
    setTheme,
    theme,
}: {
    toggleDrawer: () => void;
    setTheme: (theme: ETheme) => void;
    theme: ETheme;
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function checkLoginStatus() {
        const cookies = document.cookie.split("; ");
        const loggedInCookie = cookies.find((cookie) =>
            cookie.startsWith("wordpress_logged_in_")
        );
        return !!loggedInCookie; 
    };

    function toggleTheme(){
        const newTheme = (theme == ETheme.dark ? ETheme.light : ETheme.dark);
        document.documentElement.setAttribute('data-theme', newTheme );
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg'));
        setTheme(newTheme);
    }

    const ThemeToggleComponent = () => {
        return <button 
            onClick={toggleTheme} 
            aria-label="toggle theme"
            style={{height: '100%', borderRadius: 8, fontSize: 22, padding:6, aspectRatio: 1}}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="#FFF" height="24px" width="24px">
                {theme == ETheme.dark ? 
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    : 
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                }
            </svg>
        </button>
    }

    useEffect(() => {
        setIsLoggedIn(checkLoginStatus());
    }, []);

    return (
        <header id="masthead" className="site-header">
            <nav id="site-navigation" className="container-large px-md-5">
                <div className="row align-items-center">
                    <div className="col col-7 col-md-3 col-xl-2 header-logo site-logo"> 
                        <a href="https://www.scichart.com/" className="text-decoration-none">
                            <img src="https://www.scichart.com/wp-content/themes/scichartv6/assets/icons/scichart-logo.svg" alt="SciChart" width="312" height="69"/>
                        </a>
                    </div>
                    <div className="col col-5 col-md-9 col-xl-10 header-nav"> 
                <a href="#site-navigation" data-target="body" className="className-toggler d-block d-xl-none position-relative overflow-hidden main-menu-button ms-auto"> 
                    <i className="d-block start-0 top-0 position-absolute w-100 bg-white"></i> <i className="d-block start-0 bottom-0 position-absolute w-100 bg-white"></i> <span>Menu</span> </a>
                <div className="className-toggler main-menu-shadow d-block d-xl-none position-fixed top-0 start-0 w-100 h-100" data-target="body"></div>
                <div className="main-menu">
                    <div className="menu-main-nav-container">
                        <ul id="primary-menu" className="menu">
                            <li id="menu-item-545" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-545">
                <a href="#">Why SciChart</a>
                <ul className="sub-menu">
                    <li id="menu-item-4509" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-4509">
                <a href="https://www.scichart.com/why-scichart-for-developers/">Why SciChart for Developers</a></li>
                <hr/>
                <li id="menu-item-4948" className="line menu-item menu-item-type-post_type menu-item-object-page menu-item-4948">
                <a href="https://www.scichart.com/why-scichart-high-performance-realtime-big-data-charts/" title="Big Data Visualization and High Performance Charts">Big Data High Performance</a></li>
                <li id="menu-item-5033" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5033">
                <a href="https://www.scichart.com/comparison-of-scichart-vs-open-source-chart-controls/" title="Should you use Open Source Charts?">SciChart vs Open Source</a></li>
                <hr/>
                <li id="menu-item-7923" className="line menu-item menu-item-type-custom menu-item-object-custom menu-item-7923">
                <a href="https://www.scichart.com/why-scichart-the-best-wpf-chart/">Best WPF Charts</a></li>
                <li id="menu-item-7924" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7924">
                <a href="https://www.scichart.com/blog/the-best-javascript-chart-10-reasons/">Best JavaScript Charts</a></li>
                <hr/>

                <li id="menu-item-4956" className="line menu-item menu-item-type-post_type menu-item-object-page menu-item-4956">
                <a href="https://www.scichart.com/about-us/" title="About SciChart – Our Company">Our Company</a></li>
                <li id="menu-item-7589" className="menu-item menu-item-type-post_type menu-item-object-blog_scichart menu-item-7589">
                <a href="https://www.scichart.com/blog/from-small-beginnings-to-global-impact/" title="About SciChart – Our Story">Our Story</a></li>
                <hr/>
                <li id="menu-item-598" className="line menu-item menu-item-type-post_type menu-item-object-page menu-item-598">
                <a href="https://www.scichart.com/why-scichart-world-className-tech-support/" title="SciChart Testomianals about Tech Support ">World ClassName Tech Support</a></li>
                <li id="menu-item-596" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-596">
                <a href="https://www.scichart.com/read-testimonials/">Testimonial &amp; Reviews</a></li></ul></li>
                <li id="menu-item-3350" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-3350">
                <a href="#">Products</a>
                <ul className="sub-menu">
                    <li id="menu-item-7873" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7873">
                <a href="https://www.scichart.com/javascript-chart-features/" title="Javascript Chart Library">JavaScript Charts</a></li>
                <li id="menu-item-8501" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8501">
                <a href="https://www.scichart.com/react-charts/">React Charts</a></li>
                <li id="menu-item-547" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-547">
                <a href="https://www.scichart.com/wpf-chart-features/">WPF Charts</a></li>
                <li id="menu-item-548" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-548">
                <a href="https://www.scichart.com/wpf-3d-chart-features/">WPF 3D Charts</a></li>
                <li id="menu-item-549" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-549">
                <a href="https://www.scichart.com/ios-chart-features/" title="iOS Charts Swift Library">iOS &amp; macOS Charts</a></li>
                <li id="menu-item-550" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-550">
                <a href="https://www.scichart.com/android-chart-features/" title="Android Charts Library">Android Charts</a></li>
                <li id="menu-item-3351" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-3351">
                <a href="https://www.scichart.com/examples/xamarin-chart/">Xamarin Charts</a></li>
                <hr/>

                <li id="menu-item-5114" className="line menu-item menu-item-type-custom menu-item-object-custom menu-item-5114">
                <a href="https://www.scichart.com/consultancy/" title="Expert DataVisualization Consultancy Services">Consultancy Services</a></li>
                <hr/>

                <li id="menu-item-4949" className="line menu-item menu-item-type-custom menu-item-object-custom menu-item-4949">
                <a href="https://store.scichart.com" title="SciChart Store">Pricing</a></li></ul></li>
                <li id="menu-item-566" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-566">
                <a href="#" title="SciChart Developer Zone">Developers</a>
                <ul className="sub-menu">
                    <li id="menu-item-4953" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-4953">
                <a href="https://www.scichart.com/getting-started/" title="Get Started with SciChart">GET STARTED</a></li>
                <hr/>
                <li id="menu-item-579" className="line menu-item menu-item-type-post_type menu-item-object-page menu-item-579">
                <a href="https://www.scichart.com/examples/" title="Chart Library Examples and Demos">Examples</a></li>
                <li id="menu-item-577" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-577">
                <a href="https://www.scichart.com/read-tutorials/" title="Chart Library Tutorials">Tutorials</a></li>
                <li id="menu-item-578" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-578">
                <a href="https://www.scichart.com/read-documentation/" title="Chart Library Documentation">Documentation</a>
                <ul className="sub-menu">
                    <li id="menu-item-8029" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8029">
                <a href="https://www.scichart.com/documentation/win/current/webframe.html#SciChart_WPF_SDK_User_Manual.html" title="WPF Chart Documentation">WPF Docs</a></li>
                <li id="menu-item-8028" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8028">
                <a href="https://www.scichart.com/documentation/js/current/webframe.html#SciChart_JS_User_Manual.html" title="JS Chart Documentation">JS Docs</a></li>
                <li id="menu-item-8030" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8030">
                <a href="https://scichart.com/documentation/android/current/" title="Android Charts Documentation">Android Docs</a></li>
                <li id="menu-item-8031" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8031">
                <a href="https://www.scichart.com/documentation/ios/current/" title="iOS Charts Documentation">iOS Docs</a></li></ul></li>
                <li id="menu-item-8108" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-8108">
                <a href="#" title="Chart Library Changelog">Changelog</a>
                <ul className="sub-menu">
                    <li id="menu-item-8113" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8113">
                <a href="https://www.scichart.com/changelog/scichart-wpf/" title="WPF Chart Library Changelog">SciChart WPF Changelog</a></li>
                <li id="menu-item-8109" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8109">
                <a href="https://scichart.com/changelog/scichart-js/" title="JS Chart Library Changelog">SciChart.js Changelog</a></li>
                <li id="menu-item-8610" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-8610">
                <a href="https://www.scichart.com/changelog/scichart-ios-android/" title="iOS Android Charts Changelog">iOS Android Changelog</a></li></ul></li>
                <li id="menu-item-6893" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-6893">
                <a href="https://www.scichart.com/questions/" title="BigData Visualization Forums">Forums</a>
                <ul className="sub-menu">
                    <li id="menu-item-6973" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6973">
                <a href="https://scichart.com/questions/categories/wpf" title="WPF Chart Library Forums">WPF Forums</a></li>
                <li id="menu-item-6972" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6972">
                <a href="https://www.scichart.com/questions/categories/js" title="JavaScript Chart Library Forums">JS Forums</a></li>
                <li id="menu-item-6975" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6975">
                <a href="https://scichart.com/questions/categories/android" title="Android Charts Forums">Android Forums</a></li>
                <li id="menu-item-6974" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6974">
                <a href="https://scichart.com/questions/categories/ios" title="iOS Charts Forums">iOS Forums</a></li></ul></li>
                <li id="menu-item-582" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-582">
                <a target="_blank" href="https://stackoverflow.com/questions/tagged/scichart">StackOverflow</a>

                <ul className="sub-menu">
                    <li id="menu-item-7053" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7053">
                <a href="https://stackoverflow.com/questions/tagged/scichart" title="SciChart Tag on StackOverflow">SciChart tag</a></li>
                <li id="menu-item-7054" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7054">
                <a href="https://stackoverflow.com/questions/tagged/scichart.js" title="SciChart.js Tag on StackOverflow">SciChart.js tag</a></li></ul></li>
                <hr/>

                <li id="menu-item-581" className="line menu-item menu-item-type-custom menu-item-object-custom menu-item-581">
                <a href="https://www.scichart.com/contact-us/#tech-support" title="Chart Library Technical Support">Support</a></li>
                <li id="menu-item-7080" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7080">
                <a href="https://www.scichart.com/licensing-scichart/" title="Chart Library Licensing">Licensing</a></li>
                <li id="menu-item-4952" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-4952">
                <a target="_blank" href="https://www.scichart.com/downloads/" title="Chart Library Downloads">Downloads</a></li></ul></li>
                <li id="menu-item-3835" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-3835">
                <a href="#">Showcase</a>
                <ul className="sub-menu">
                    <li id="menu-item-4193" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-4193">
                <a href="https://www.scichart.com/examples/javascript-chart/">JavaScript Examples</a></li>
                <li id="menu-item-3836" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-3836">
                <a href="https://www.scichart.com/examples/wpf-chart/">WPF Examples</a></li>
                <li id="menu-item-4954" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-4954">
                <a href="https://www.scichart.com/examples/3d-charts-wpf-chart/">WPF 3D Examples</a></li>
                <li id="menu-item-3837" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-3837">
                <a href="https://www.scichart.com/examples/ios-chart/">iOS &amp; macOS Examples</a></li>
                <li id="menu-item-3838" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-3838">
                <a href="https://www.scichart.com/examples/android-chart/">Android Examples</a></li>
                <hr/>

                <li id="menu-item-5069" className="line menu-item menu-item-type-custom menu-item-object-custom menu-item-5069">
                <a href="https://www.scichart.com/case-studies/">Case Studies</a></li></ul></li>
                <li id="menu-item-3358" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-3358">
                <a href="#" title="DataVisualization Industries and Applications">Industries</a>
                <ul className="sub-menu">
                    <li id="menu-item-3359" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-3359">
                <a href="https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/">Financial &amp; Trading</a></li>
                <li id="menu-item-7424" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7424">
                <a href="https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/">Medical &amp; Research</a></li>
                <li id="menu-item-8025" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-8025">
                <a href="https://www.scichart.com/why-scichart-diagnostics-lifesciences/">Diagnostics &amp; Lifesciences</a></li>
                <li id="menu-item-7320" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7320">
                <a href="https://www.scichart.com/why-scichart-best-for-motosport-and-automotive/">Motorsport &amp; Automotive</a></li>
                <li id="menu-item-7331" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7331">
                <a href="https://www.scichart.com/why-scichart-perfect-for-datavisualization-in-the-oil-gas-industry-using-scichart/">Oil &amp; Gas</a></li>
                <li id="menu-item-7496" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-7496">
                <a href="https://www.scichart.com/why-scichart-aerospace-defence/">Aerospace &amp; Defence</a></li>
                <li id="menu-item-9663" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-9663">
                <a href="https://www.scichart.com/design-emulation-test/">Design, Emulation &amp; Test</a></li>
                <li id="menu-item-9985" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-9985">
                <a href="https://www.scichart.com/blog/telehealth-transforming-healthcare-analytics-with-advanced-charting-dashboards/">Telehealth</a></li></ul></li>
                <li id="menu-item-4955" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-4955">
                <a href="#">News</a>
                <ul className="sub-menu">
                    <li id="menu-item-3305" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-3305">
                <a href="https://www.scichart.com/blog/" title="Chart Library Blog">Blogs</a></li>
                <li id="menu-item-561" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-561">
                <a href="https://www.scichart.com/news/">Releases &amp; News</a></li></ul></li>
                <li id="menu-item-7783" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7783">
                <a href="https://www.scichart.com/contact-us/">Contact Us</a></li>

                <ThemeToggleComponent />

                <li id="menu-item-5373" className="button menu-item menu-item-type-custom menu-item-object-custom menu-item-5373">
                <a href="https://www.scichart.com/shop/" rel="nofollow" role="button">Buy Now</a></li>
                <li id="menu-item-cta-alt" className="button dark menu-item menu-item-type-custom menu-item-object-custom menu-item-cta">
                <a href="https://www.scichart.com/getting-started/" target="" rel="nofollow" role="button">FREE Trial</a></li>
                
                {isLoggedIn ?
                    <li className="menu-item-has-children children-end menu-item button-icon login scichart-profile-nav"><a href="#!">Account</a>
                        <ul className="sub-menu">
                            <li className="menu-item"><a href="https://www.scichart.com/my-account/">My Account</a></li>
                            <li className="menu-item"><a href="https://www.scichart.com/downloads/?nocache=1">Downloads</a></li>
                            <hr/>
                            <li className="menu-item line"><a href="https://www.scichart.com/wp-login.php?action=logout&amp;redirect_to=%2Flogin%2F%3Fmessage%3Dlogged-out&amp;_wpnonce=b22d2ac2bb">Logout</a></li>
                        </ul>
                    </li>
                :
                    <li className="menu-item-has-children children-end menu-item scichart-login-link button-icon login"><a href="#login">Log In</a>
                        <ul className="sub-menu">
                            <li className="menu-item"><a href="https://www.scichart.com/login/">Login</a></li>
                            <li className="menu-item"><a href="https://www.scichart.com/register/">Register</a></li>
                        </ul>
                    </li>
                }
            </ul>
        </div></div></div></div>
                
                {/* Mobile only */}
                <div className="mobile-buttons">
                    <div className="icon">
                        <ThemeToggleComponent />
                    </div>
                    <div className="icon menu-burger">
                        <Button onClick={toggleDrawer} aria-label="menu" sx={{ minWidth: 36 }}>
                            <MenuIcon 
                                sx={{ color: '#888' }}
                            />
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    )
}