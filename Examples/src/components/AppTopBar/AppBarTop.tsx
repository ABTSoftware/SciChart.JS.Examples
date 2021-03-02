import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import GitHubIcon from "@material-ui/icons/GitHub";
import Search from "../Search/Search";
import classes from './AppTopBar.module.scss';

type TProps = {
    toggleDrawer: () => void;
};

const AppBarTop: React.FC<TProps> = props => {
    const { toggleDrawer } = props;

    const openGithub = () => {
        window.open("https://github.com/ABTSoftware/SciChart.JS.Examples");
    };

    return (
        <AppBar position="sticky">
            <Toolbar className={classes.AppBar}>
                <IconButton
                    onClick={toggleDrawer}
                    edge="start"
                    className={classes.MenuButton}
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon />
                </IconButton>
                <Search />
                <div className={classes.FlexPlaceholder} />
                <IconButton onClick={openGithub} aria-label="github" color="inherit">
                    <GitHubIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarTop;
