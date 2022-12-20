import * as React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Navigation from "../Navigation/Navigation";
import { useNavigate } from "react-router-dom";
import classes from "./DrawerContent.module.scss";

// tslint:disable-next-line:no-var-requires
const APP_VERSION = require("../../../package.json").dependencies.scichart;

type TProps = {
    testIsOpened: (id: string) => boolean;
    toggleOpenedMenuItem: (id: string) => void;
    toggleDrawer: () => void;
};

const DrawerContent: React.FC<TProps> = props => {
    const navigate = useNavigate();

    const { testIsOpened, toggleOpenedMenuItem, toggleDrawer } = props;

    return (
        <div className={classes.DrawerContent}>
            <div className={classes.DrawerTopSection}>
                <div className={classes.toolbar}>
                    <h6 className={classes.homepageLink} onClick={() => navigate("/")}>
                        SciChart.js
                    </h6>
                    <span className={classes.versionCaption}>{`v${APP_VERSION}`}</span>
                </div>
                <IconButton
                    onClick={toggleDrawer}
                    className={classes.CloseButton}
                    aria-label="close-drawer-button"
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <Divider />
            <Navigation testIsOpened={testIsOpened} onExpandClick={toggleOpenedMenuItem} toggleDrawer={toggleDrawer} />
        </div>
    );
};

export default DrawerContent;
