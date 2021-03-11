import * as React from "react";
import classes from "./ComponentWrapper.module.scss";
type TProps = {
    children: React.ReactNode;
};

export default function ComponentWrapper(props: TProps) {
    return <div className={classes.ComponentWrapper}>{props.children}</div>;
}
