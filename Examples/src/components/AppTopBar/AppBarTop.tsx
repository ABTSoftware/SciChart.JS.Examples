import { FC, useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import GitHubIcon from "@mui/icons-material/GitHub";
import BookIcon from "@mui/icons-material/Book";
import MenuIcon from "@mui/icons-material/Menu";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Search from "../Search/Search";
import classes from "./AppTopBar.module.scss";
import Logo from "../../images/scichart-logo-app-bar.svg";
import LogoSmall from "../../images/scichart-logo-app-bar-mobile.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import npm from "./npm.svg";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { libraryVersion } from "scichart";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";
import { ETheme } from "../../helpers/types/types";

type TProps = {
    toggleDrawer: () => void;
    currentExample?: TExamplePage;
    theme: ETheme;
    setTheme: (theme: ETheme) => void;
};

const AppBarTop: FC<TProps> = (props) => {
    const { toggleDrawer, currentExample, theme, setTheme } = props;
    const selectedFramework = useContext(FrameworkContext);

    function toggleTheme(){
        const newTheme = (theme == ETheme.dark ? ETheme.light : ETheme.dark);
        document.documentElement.setAttribute('data-theme', newTheme );
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg'));
        setTheme(newTheme);
    }

    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const contextualGithub =
        currentExample?.filepath !== undefined
            ? baseGithubPath + "/components/Examples/" + currentExample.filepath
            : "https://github.com/ABTSoftware/SciChart.JS.Examples";
    const contextualGithubTitle =
        currentExample !== undefined
            ? `View source for ${getFrameworkContent(currentExample.title, selectedFramework)} on Github`
            : "Clone SciChart.js.examples on GitHub";
    const docLinks = currentExample?.documentationLinks;
    const contextualDocUrl =
        docLinks !== undefined && docLinks.length > 0
            ? docLinks[0].href
            : "https://www.scichart.com/javascript-chart-documentation";
    const contextualDocTitle =
        docLinks !== undefined && docLinks.length > 0 ? docLinks[0].title : "SciChart.js Documentation Home";

    const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")); // Medium view

    return (
        <AppBar position="sticky" className={classes.AppBar}>
            <Toolbar className={classes.ToolBar} disableGutters>
                <a className={classes.Logo} href="https://demo.scichart.com/" title="SciChart Demo">
                    {typeof window !== "undefined" && window?.innerWidth <= 768 ? (
                        <img className={classes.LogoSmall} src={LogoSmall} alt="scichart-logo" />
                    ) : (
                        <img className={classes.LogoDefault} src={Logo} alt="scichart-logo" />
                    )}
                </a>
                <Box className={classes.ToolBarMenu}>
                    {isMd ? null : (
                        <>
                            <a
                                href="https://www.scichart.com/documentation/js/current/typedoc/index.html"
                                title="SciChart.js TypeDoc"
                                target="_blank"
                            >
                                <Chip  
                                    className={classes.versionChip}
                                    sx={{
                                        background:
                                            "linear-gradient(45deg, rgb(42, 99, 151), rgb(113, 55, 149), rgb(160, 36, 142))",
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                    label={`v${libraryVersion}`}
                                    variant="outlined"
                                />
                            </a>

                            <Search />
                        </>
                    )}
                    <div className={classes.FlexPlaceholder}></div>
                    <Button 
                        onClick={toggleTheme} 
                        className={classes.ThemeButton} aria-label="toggle theme"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                            {theme == ETheme.dark ? 
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                : 
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            }
                        </svg>
                    </Button>

                    <Button
                        className={classes.BlueButton}
                        href="https://www.scichart.com/getting-started/scichart-javascript/"
                        target="_blank"
                        title="Get a FREE Community license"
                        style={{ color: "white" }}
                    >
                        Get it FREE
                    </Button>
                    <Button
                        className={classes.PurpleButton}
                        href={contextualDocUrl}
                        title={contextualDocTitle}
                        target="_blank"
                        style={{ color: "white" }}
                    >
                        <BookIcon fontSize="small" style={{ color: "white" }} />
                        &nbsp;Docs
                    </Button>
                    <a
                        className={classes.GitHubLink}
                        href={contextualGithub}
                        title={contextualGithubTitle}
                        target="_blank"
                    >
                        <GitHubIcon fontSize="small" />
                    </a>
                    <a
                        className={classes.NpmLink}
                        href="https://www.npmjs.com/package/scichart"
                        title="npmjs / SciChart"
                        target="_blank"
                    >
                        <img src={npm} alt="Npm Logo" width={32} height={32} />
                    </a>
                    <Button onClick={toggleDrawer} className={classes.MenuButton} aria-label="menu">
                        <MenuIcon />
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarTop;
