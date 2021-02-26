import * as React from "react";
import classes from "./Description.module.scss";

type TProps = {
    children: React.ReactNode;
};

const Description: React.FC<TProps> = props => {
    return (
        <React.Fragment>
            <p className={classes.description}>
                Description
            </p>
            {props.children}
        </React.Fragment>
    );
};

export default Description;
