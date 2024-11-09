import { FC, useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import GitHubIcon from "@mui/icons-material/GitHub";
import BookIcon from "@mui/icons-material/Book";
import MenuIcon from "@mui/icons-material/Menu";
import Search from "../Search/Search";
import classes from "./AppTopBar.module.scss";
import Logo from "../../images/scichart-logo-app-bar.svg";
import LogoSmall from "../../images/scichart-logo-app-bar-mobile.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import npm from "./npm.svg";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    toggleDrawer: () => void;
    currentExample?: TExamplePage;
};

const AppBarTop: FC<TProps> = (props) => {
    const { toggleDrawer, currentExample } = props;
    const selectedFramework = useContext(FrameworkContext);
    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const contextualGithub =
        currentExample?.filepath !== undefined
            ? baseGithubPath + "/components/Examples/" + currentExample.filepath
            : "https://github.com/ABTSoftware/SciChart.JS.Examples";
    const contextualGithubTitle =
        currentExample !== undefined
            ? `View source for ${getTitle(currentExample.title, selectedFramework)} on Github`
            : "Clone SciChart.js.examples on GitHub";
    const docLinks = currentExample?.documentationLinks;
    const contextualDocUrl =
        docLinks !== undefined && docLinks.length > 0
            ? docLinks[0].href
            : "https://www.scichart.com/javascript-chart-documentation";
    const contextualDocTitle =
        docLinks !== undefined && docLinks.length > 0 ? docLinks[0].title : "SciChart.js Documentation Home";

    return (
        <AppBar position="sticky" className={classes.AppBar}>
            <Toolbar className={classes.ToolBar}>
                <a href="https://demo.scichart.com/" title="SciChart Demo">
                    {typeof window !== "undefined" && window?.innerWidth <= 768 ? (
                        <img className={classes.Logo} src={LogoSmall} alt="scichart-logo" />
                    ) : (
                        <img className={classes.Logo} src={Logo} alt="scichart-logo" />
                    )}
                </a>
                <Search />
                <div className={classes.FlexPlaceholder}></div>
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
                <a className={classes.GitHubLink} href={contextualGithub} title={contextualGithubTitle} target="_blank">
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
                <Button
                    onClick={toggleDrawer}
                    className={classes.MenuButton}
                    aria-label="menu"
                >
                    <MenuIcon />
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarTop;
