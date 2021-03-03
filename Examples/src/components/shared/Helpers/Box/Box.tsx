import * as React from "react";

type TProps = {
    mb?: number;
    ml?: number;
    mt?: number;
    mr?: number;
    className?: string;
    children?: React.ReactNode;
};

export default function Box(props: TProps) {
    const style = {
        marginBottom: props.mb ? `${props.mb}px` : "",
        marginTop: props.mt ? `${props.mt}px` : "",
        marginLeft: props.ml ? `${props.ml}px` : "",
        marginRight: props.mr ? `${props.mr}px` : ""
    };

    return (
        <div style={style} className={props.className ? props.className : ""}>
            {props.children}
        </div>
    );
}
