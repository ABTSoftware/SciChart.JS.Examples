import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Navigation from "../Navigation/Navigation";
import { useHistory } from "react-router-dom";
import classes from "./DrawerContent.module.scss";

// tslint:disable-next-line:no-var-requires
const APP_VERSION = require("../../../package.json").dependencies.scichart;

type TProps = {
    testIsOpened: (id: string) => boolean;
    toggleOpenedMenuItem: (id: string) => void;
    toggleDrawer: () => void;
};

const DrawerContent: React.FC<TProps> = props => {
    const history = useHistory();

    const { testIsOpened, toggleOpenedMenuItem, toggleDrawer } = props;

    return (
        <div className={classes.DrawerContent}>
            <div className={classes.toolbar}>
                <h6 className={classes.homepageLink} onClick={() => history.push("/")}>
                    SciChart.js
                </h6>
                <span className={classes.versionCaption}>{`v${APP_VERSION}`}</span>
            </div>
            <Divider />
            <Navigation testIsOpened={testIsOpened} onExpandClick={toggleOpenedMenuItem} toggleDrawer={toggleDrawer} />
        </div>
    );
};

export default DrawerContent;
