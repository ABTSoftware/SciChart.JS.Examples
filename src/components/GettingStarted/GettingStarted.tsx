import Typography from "@material-ui/core/Typography";
import * as React from "react";

const GettingStarted = () => {
    return (
        <React.Fragment>
            <Typography variant="h5" variantMapping={{ h5: "p" }} gutterBottom>
                Getting Started
            </Typography>
            <div>Getting started text....</div>
        </React.Fragment>
    );
};

export default GettingStarted;
