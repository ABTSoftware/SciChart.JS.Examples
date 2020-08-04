import Typography from "@material-ui/core/Typography";
import * as React from "react";

type TProps = {
    children: React.ReactNode;
};

const Description: React.FC<TProps> = props => {
    return (
        <React.Fragment>
            <Typography variant="h5" variantMapping={{ h5: "p" }} gutterBottom>
                Description
            </Typography>
            {props.children}
        </React.Fragment>
    );
};

export default Description;
