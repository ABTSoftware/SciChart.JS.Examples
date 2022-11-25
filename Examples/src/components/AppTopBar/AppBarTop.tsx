import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import GitHubIcon from "@material-ui/icons/GitHub";
import Search from "../Search/Search";
import classes from './AppTopBar.module.scss';
import Logo from "../../images/scichart-logo-app-bar.svg";
import {TExamplePage} from "../AppRouter/examplePages";

type TProps = {
    toggleDrawer: () => void;
    currentExample?: TExamplePage;
};

const AppBarTop: React.FC<TProps> = props => {
    const { toggleDrawer, currentExample } = props;

    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const contextualGithub = currentExample?.githubUrl !== undefined ? baseGithubPath + currentExample.githubUrl : "https://github.com/ABTSoftware/SciChart.JS.Examples";
    const contextualGithubTitle = currentExample !== undefined ? `View source for ${currentExample.title} on Github` : "Clone SciChart.js.examples on GitHub";
    const docLinks = currentExample?.documentationLinks;
    const contextualDocUrl = docLinks !== undefined && docLinks.length > 0 ? docLinks[0].href : "https://www.scichart.com/javascript-chart-documentation";
    const contextualDocTitle = docLinks !== undefined && docLinks.length > 0 ? docLinks[0].title : "SciChart.js Documentation Home";

    return (
        <AppBar position="sticky" className={classes.AppBar}>
            <Toolbar className={classes.ToolBar}>
                <a href="https://demo.scichart.com/" title="SciChart Demo">
                    <img className={classes.Logo} src={Logo} alt="scichart-logo" />
                </a>
                <Search />
                <div className={classes.FlexPlaceholder} />
                <Button className={classes.BlueButton} href="https://www.scichart.com/getting-started/scichart-javascript/" target="_blank" title="Start a trial or community license">
                    Get Started
                </Button>
                <Button className={classes.PurpleButton} href={contextualDocUrl} title={contextualDocTitle} target="_blank" >
                    Documentation
                </Button>
                <a className={classes.GitHubLink} href={contextualGithub} title={contextualGithubTitle} target="_blank" >
                    <GitHubIcon fontSize="small" />
                </a>
                <IconButton
                    onClick={toggleDrawer}
                    edge="start"
                    className={classes.MenuButton}
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarTop;
