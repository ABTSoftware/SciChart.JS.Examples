import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Navigation from "../Navigation/Navigation";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

// tslint:disable-next-line:no-var-requires
const APP_VERSION = require("../../../package.json").dependencies.scichart;

type TProps = {
    testIsOpened: (id: string) => boolean;
    toggleOpenedMenuItem: (id: string) => void;
    toggleDrawer: () => void;
};

const useStyles = makeStyles(theme => ({
    toolbar: {
        ...theme.mixins.toolbar,
        paddingLeft: theme.spacing(2)
    }
}));

const DrawerContent: React.FC<TProps> = props => {
    const classes = useStyles();
    const history = useHistory();

    const { testIsOpened, toggleOpenedMenuItem, toggleDrawer } = props;

    return (
        <>
            <div className={classes.toolbar}>
                <Typography
                    variant="h6"
                    style={{ color: "rgba(0, 0, 0, 0.54)", cursor: "pointer", marginTop: 6 }}
                    onClick={() => history.push("/")}
                >
                    SciChart.js
                </Typography>
                <Typography variant="caption" style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                    {`v${APP_VERSION}`}
                </Typography>
            </div>
            <Divider />
            <Navigation testIsOpened={testIsOpened} onExpandClick={toggleOpenedMenuItem} toggleDrawer={toggleDrawer} />
        </>
    );
};

export default DrawerContent;
