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

type TProps = {
    toggleDrawer: () => void;
};

const AppBarTop: React.FC<TProps> = props => {
    const { toggleDrawer } = props;

    return (
        <AppBar position="sticky" className={classes.AppBar}>
            <Toolbar className={classes.ToolBar}>
                <a href="https://demo.scichart.com/" title="SciChart Demo">
                    <img className={classes.Logo} src={Logo} alt="scichart-logo" />
                </a>
                <Search />
                <div className={classes.FlexPlaceholder} />
                <Button className={classes.DownloadTrialButton} href="https://www.scichart.com/downloads/" target="_blank">
                    Download Trial
                </Button>
                <a className={classes.GitHubLink} href="https://github.com/ABTSoftware/SciChart.JS.Examples" title="SciChart on GitHub">
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
