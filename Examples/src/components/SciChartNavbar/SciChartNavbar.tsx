import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";

import { useEffect, useRef, useState } from "react";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import { ETheme } from "../../helpers/types/types";

// for testing only - to see logged in UI
// document.cookie = "wordpress_logged_in_=true;expires=Thu,18Dec2023-12:00:00UTC;path=/";

export default function SciChartNavbar({ toggleDrawer }: { toggleDrawer: () => void }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { state, setTheme } = _useContext();
    const theme = state.theme;

    function checkLoginStatus() {
        const cookies = document.cookie.split("; ");
        const loggedInCookie = cookies.find((cookie) => cookie.startsWith("wordpress_logged_in_"));
        return !!loggedInCookie;
    }

    const getThemeLabel = (themeValue: ETheme) =>
        themeValue === ETheme.navy ? "SciChartNavy" : themeValue === ETheme.light ? "SciChartLight" : "SciChartDark";

    const currentThemeLabel = getThemeLabel(theme);

    const themeOptions: Array<{ value: ETheme; label: string }> = [
        { value: ETheme.navy, label: getThemeLabel(ETheme.navy) },
        { value: ETheme.light, label: getThemeLabel(ETheme.light) },
        { value: ETheme.dark, label: getThemeLabel(ETheme.dark) },
    ];

    const ThemeIcon = ({ themeValue, size = 22 }: { themeValue: ETheme; size?: number }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox={themeValue === ETheme.dark ? "-1 -1 26 26" : "0 0 24 24"}
            strokeWidth="1.5"
            stroke="currentColor"
            height={`${size}px`}
            width={`${size}px`}
        >
            {themeValue === ETheme.light ? (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
            ) : themeValue === ETheme.dark ? (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 11c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
                </>
            )}
        </svg>
    );

    const ThemeSelectComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const handleOutsideClick = (event: MouseEvent) => {
                if (!menuRef.current) return;
                if (!menuRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };

            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    setIsOpen(false);
                }
            };

            document.addEventListener("mousedown", handleOutsideClick);
            document.addEventListener("keydown", handleEscape);
            return () => {
                document.removeEventListener("mousedown", handleOutsideClick);
                document.removeEventListener("keydown", handleEscape);
            };
        }, []);

        return (
            <div ref={menuRef} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <button
                    type="button"
                    aria-label="select theme"
                    aria-expanded={isOpen}
                    title={`Current theme: ${currentThemeLabel}`}
                    onClick={() => setIsOpen((prev) => !prev)}
                    style={{
                        height: "100%",
                        borderRadius: 8,
                        padding: "6px",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(255,255,255,0.06)",
                        cursor: "pointer",
                    }}
                >
                    <ThemeIcon themeValue={theme} />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        width="14"
                        height="14"
                        style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 120ms ease",
                        }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        role="listbox"
                        aria-label="Theme options"
                        style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            borderRadius: 10,
                            padding: 6,
                            background: "rgba(24, 24, 28, 0.98)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                            zIndex: 2000,
                        }}
                    >
                        {themeOptions.map((option) => {
                            const isSelected = option.value === theme;
                            return (
                                <button
                                    type="button"
                                    key={option.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        setTheme(option.value);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 10,
                                        padding: "8px 10px",
                                        borderRadius: 8,
                                        background: isSelected ? "rgba(255,255,255,0.15)" : "transparent",
                                        color: "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                                        <ThemeIcon themeValue={option.value} size={18} />
                                        <span style={{ fontWeight: 500 }}>{option.label}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        setIsLoggedIn(checkLoginStatus());
    }, []);

    return (
        <header id="masthead" className="sc-app-nav-site-header">
            <nav id="site-navigation">
                <div className="sc-app-nav-row">
                    <div className="sc-app-nav-site-logo">
                        <a href="https://www.scichart.com/" style={{ overflow: "visible" }}>
                            <img
                                src="https://www.scichart.com/wp-content/themes/scichartv6/assets/icons/scichart-logo.svg"
                                alt="SciChart"
                                width="312"
                                height="69"
                            />
                        </a>
                    </div>
                    <div className="sc-app-nav-header-nav">
                        <a href="#site-navigation" data-target="body" className="sc-app-nav-main-menu-button">
                            <i></i> <i></i> <span>Menu</span>{" "}
                        </a>
                        <div data-target="body"></div>
                        <div>
                            <div>
                                <ul id="primary-menu">
                                    <li id="menu-item-545" className="sc-app-nav-menu-item">
                                        <a href="#">Why SciChart</a>
                                        <ul className="sc-app-nav-sub-menu">
                                            <li id="menu-item-4509" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-for-developers/">
                                                    Why SciChart for Developers
                                                </a>
                                            </li>
                                            <hr />
                                            <li id="menu-item-4948" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/why-scichart-high-performance-realtime-big-data-charts/"
                                                    title="Big Data Visualization and High Performance Charts"
                                                >
                                                    Big Data High Performance
                                                </a>
                                            </li>
                                            <li id="menu-item-5033" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/comparison-of-scichart-vs-open-source-chart-controls/"
                                                    title="Should you use Open Source Charts?"
                                                >
                                                    SciChart vs Open Source
                                                </a>
                                            </li>
                                            <hr />
                                            <li id="menu-item-7923" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-the-best-wpf-chart/">
                                                    Best WPF Charts
                                                </a>
                                            </li>
                                            <li id="menu-item-7924" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/blog/the-best-javascript-chart-10-reasons/">
                                                    Best JavaScript Charts
                                                </a>
                                            </li>
                                            <hr />

                                            <li id="menu-item-4956" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/about-us/"
                                                    title="About SciChart – Our Company"
                                                >
                                                    Our Company
                                                </a>
                                            </li>
                                            <li id="menu-item-7589" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/blog/from-small-beginnings-to-global-impact/"
                                                    title="About SciChart – Our Story"
                                                >
                                                    Our Story
                                                </a>
                                            </li>
                                            <hr />
                                            <li id="menu-item-598" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/why-scichart-world-class-tech-support/"
                                                    title="SciChart Testomianals about Tech Support "
                                                >
                                                    World Class Tech Support
                                                </a>
                                            </li>
                                            <li id="menu-item-596" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/read-testimonials/">
                                                    Testimonial &amp; Reviews
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li id="menu-item-3350" className="sc-app-nav-menu-item">
                                        <a href="#">Products</a>
                                        <ul className="sc-app-nav-sub-menu">
                                            <li id="menu-item-7873" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/javascript-chart-features/"
                                                    title="Javascript Chart Library"
                                                >
                                                    JavaScript Charts
                                                </a>
                                            </li>
                                            <li id="menu-item-8501" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/react-charts/">React Charts</a>
                                            </li>
                                            <li id="menu-item-547" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/wpf-chart-features/">WPF Charts</a>
                                            </li>
                                            <li id="menu-item-548" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/wpf-3d-chart-features/">
                                                    WPF 3D Charts
                                                </a>
                                            </li>
                                            <li id="menu-item-549" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/ios-chart-features/"
                                                    title="iOS Charts Swift Library"
                                                >
                                                    iOS &amp; macOS Charts
                                                </a>
                                            </li>
                                            <li id="menu-item-550" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/android-chart-features/"
                                                    title="Android Charts Library"
                                                >
                                                    Android Charts
                                                </a>
                                            </li>
                                            <li id="menu-item-3351" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/examples/xamarin-chart/">
                                                    Xamarin Charts
                                                </a>
                                            </li>
                                            <hr />

                                            <li id="menu-item-5114" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/consultancy/"
                                                    title="Expert DataVisualization Consultancy Services"
                                                >
                                                    Consultancy Services
                                                </a>
                                            </li>
                                            <hr />

                                            <li id="menu-item-4949" className="sc-app-nav-menu-item">
                                                <a href="https://store.scichart.com" title="SciChart Store">
                                                    Pricing
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li id="menu-item-566" className="sc-app-nav-menu-item">
                                        <a href="#" title="SciChart Developer Zone">
                                            Developers
                                        </a>
                                        <ul className="sc-app-nav-sub-menu">
                                            <li id="menu-item-4953" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/getting-started/"
                                                    title="Get Started with SciChart"
                                                >
                                                    GET STARTED
                                                </a>
                                            </li>
                                            <hr />
                                            <li id="menu-item-579" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/demo"
                                                    title="Chart Library Examples and Demos"
                                                >
                                                    Examples
                                                </a>
                                            </li>
                                            <li id="menu-item-577" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/read-tutorials/"
                                                    title="Chart Library Tutorials"
                                                >
                                                    Tutorials
                                                </a>
                                            </li>
                                            <li id="menu-item-8028" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/documentation/js/v5/intro/"
                                                    title="JS Chart Documentation"
                                                >
                                                    JS Documentation
                                                </a>
                                            </li>
                                            <li id="menu-item-8109" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/changelog/scichart-js/"
                                                    title="JS Chart Library Changelog"
                                                >
                                                    SciChart.js Changelog
                                                </a>
                                            </li>
                                            <li id="menu-item-6972" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/questions/categories/js"
                                                    title="JavaScript Chart Library Forums"
                                                >
                                                    JS Forums
                                                </a>
                                            </li>
                                            <li id="menu-item-7054" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://stackoverflow.com/questions/tagged/scichart.js"
                                                    title="SciChart.js Tag on StackOverflow"
                                                >
                                                    StackOverflow - SciChart.js
                                                </a>
                                            </li>
                                            <hr />

                                            <li id="menu-item-581" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/contact-us/#tech-support"
                                                    title="Chart Library Technical Support"
                                                >
                                                    Support
                                                </a>
                                            </li>
                                            <li id="menu-item-7080" className="sc-app-nav-menu-item">
                                                <a
                                                    href="https://www.scichart.com/licensing-scichart/"
                                                    title="Chart Library Licensing"
                                                >
                                                    Licensing
                                                </a>
                                            </li>
                                            <li id="menu-item-4952" className="sc-app-nav-menu-item">
                                                <a
                                                    target="_blank"
                                                    href="https://www.scichart.com/downloads/"
                                                    title="Chart Library Downloads"
                                                >
                                                    Downloads
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li id="menu-item-3835" className="sc-app-nav-menu-item">
                                        <a href="#">Showcase</a>
                                        <ul className="sc-app-nav-sub-menu">
                                            <li id="menu-item-4193" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/demo">JavaScript Examples</a>
                                            </li>
                                            <li id="menu-item-3836" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/examples/wpf-chart/">WPF Examples</a>
                                            </li>
                                            <li id="menu-item-4954" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/examples/3d-charts-wpf-chart/">
                                                    WPF 3D Examples
                                                </a>
                                            </li>
                                            <li id="menu-item-3837" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/examples/ios-chart/">
                                                    iOS &amp; macOS Examples
                                                </a>
                                            </li>
                                            <li id="menu-item-3838" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/examples/android-chart/">
                                                    Android Examples
                                                </a>
                                            </li>
                                            <hr />

                                            <li id="menu-item-5069" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/case-studies/">Case Studies</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li id="menu-item-3358" className="sc-app-nav-menu-item">
                                        <a href="#" title="DataVisualization Industries and Applications">
                                            Industries
                                        </a>
                                        <ul className="sc-app-nav-sub-menu">
                                            <li id="menu-item-3359" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-best-for-financial-stock-trading-applications/">
                                                    Financial &amp; Trading
                                                </a>
                                            </li>
                                            <li id="menu-item-7424" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-medical-charts-dashboarding-for-research-and-healthcare/">
                                                    Medical &amp; Research
                                                </a>
                                            </li>
                                            <li id="menu-item-8025" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-diagnostics-lifesciences/">
                                                    Diagnostics &amp; Lifesciences
                                                </a>
                                            </li>
                                            <li id="menu-item-7320" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-best-for-motosport-and-automotive/">
                                                    Motorsport &amp; Automotive
                                                </a>
                                            </li>
                                            <li id="menu-item-7331" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-perfect-for-datavisualization-in-the-oil-gas-industry-using-scichart/">
                                                    Oil &amp; Gas
                                                </a>
                                            </li>
                                            <li id="menu-item-7496" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/why-scichart-aerospace-defence/">
                                                    Aerospace &amp; Defence
                                                </a>
                                            </li>
                                            <li id="menu-item-9663" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/design-emulation-test/">
                                                    Design, Emulation &amp; Test
                                                </a>
                                            </li>
                                            <li id="menu-item-9985" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/blog/telehealth-transforming-healthcare-analytics-with-advanced-charting-dashboards/">
                                                    Telehealth
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li id="menu-item-4955" className="sc-app-nav-menu-item">
                                        <a href="#">News</a>
                                        <ul className="sc-app-nav-sub-menu">
                                            <li id="menu-item-3305" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/blog/" title="Chart Library Blog">
                                                    Blogs
                                                </a>
                                            </li>
                                            <li id="menu-item-561" className="sc-app-nav-menu-item">
                                                <a href="https://www.scichart.com/news/">Releases &amp; News</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li id="menu-item-7783" className="sc-app-nav-menu-item">
                                        <a href="https://www.scichart.com/contact-us/">Contact Us</a>
                                    </li>

                                    <li id="menu-item-theme-select" className="sc-app-nav-menu-item">
                                        <ThemeSelectComponent />
                                    </li>

                                    <li id="menu-item-5373" className="sc-app-nav-button sc-app-nav-menu-item">
                                        <a href="https://www.scichart.com/shop/" rel="nofollow" role="button">
                                            Buy Now
                                        </a>
                                    </li>
                                    <li
                                        id="menu-item-cta-alt"
                                        className="sc-app-nav-button sc-app-nav-dark sc-app-nav-menu-item"
                                    >
                                        <a
                                            href="https://www.scichart.com/getting-started/scichart-javascript/"
                                            target=""
                                            rel="nofollow"
                                            role="button"
                                        >
                                            Start for Free
                                        </a>
                                    </li>

                                    {isLoggedIn ? (
                                        <li className="sc-app-nav-menu-item sc-app-nav-button-icon sc-app-nav-login">
                                            <a href="#!">Account</a>
                                            <ul className="sc-app-nav-sub-menu">
                                                <li className="sc-app-nav-menu-item">
                                                    <a href="https://www.scichart.com/my-account/">My Account</a>
                                                </li>
                                                <li className="sc-app-nav-menu-item">
                                                    <a href="https://www.scichart.com/downloads/?nocache=1">
                                                        Downloads
                                                    </a>
                                                </li>
                                                <hr />
                                                <li className="sc-app-nav-menu-item">
                                                    <a href="https://www.scichart.com/wp-login.php?action=logout&amp;redirect_to=%2Flogin%2F%3Fmessage%3Dlogged-out&amp;_wpnonce=b22d2ac2bb">
                                                        Logout
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    ) : (
                                        <li className="sc-app-nav-menu-item sc-app-nav-button-icon sc-app-nav-login">
                                            <a href="#login">Log In</a>
                                            <ul className="sc-app-nav-sub-menu">
                                                <li className="sc-app-nav-menu-item">
                                                    <a href="https://www.scichart.com/login/">Login</a>
                                                </li>
                                                <li className="sc-app-nav-menu-item">
                                                    <a href="https://www.scichart.com/register/">Register</a>
                                                </li>
                                            </ul>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile only */}
                <div className="sc-app-nav-mobile-buttons">
                    <div>
                        <ThemeSelectComponent />
                    </div>
                    <div className="sc-app-nav-menu-burger">
                        <Button onClick={toggleDrawer} aria-label="menu" sx={{ minWidth: 36 }}>
                            <MenuIcon sx={{ color: "#fff" }} />
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
