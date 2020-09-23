import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    }
}));
const GettingStarted = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant="h5" variantMapping={{ h5: "p" }} gutterBottom>
                Getting Started
            </Typography>
            <div>Getting started text....</div>
        </div>
    );
};

export default GettingStarted;
