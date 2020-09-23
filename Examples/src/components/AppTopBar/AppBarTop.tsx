import * as React from "react";
import { createStyles, makeStyles, withStyles, Theme, fade } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import GitHubIcon from "@material-ui/icons/GitHub";
import Search from "../Search/Search";

type TProps = {
    toggleDrawer: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up("lg")]: {
                display: "none"
            }
        }
    })
);

const AppBarTop: React.FC<TProps> = props => {
    const classes = useStyles();
    const { toggleDrawer } = props;

    const openGithub = () => {
        window.open("https://github.com/ABTSoftware/SciChart.JS.Examples");
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={toggleDrawer}
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Search />
                    <div style={{ flexGrow: 1 }} />
                    <IconButton onClick={openGithub} aria-label="github" color="inherit">
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default AppBarTop;
