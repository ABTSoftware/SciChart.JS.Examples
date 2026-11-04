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
        marginBottom: props.mb ? `${props.mb / 16}rem` : "",
        marginTop: props.mt ? `${props.mt / 16}rem` : "",
        marginLeft: props.ml ? `${props.ml / 16}rem` : "",
        marginRight: props.mr ? `${props.mr / 16}rem` : "",
    };

    return (
        <div style={style} className={props.className ? props.className : ""}>
            {props.children}
        </div>
    );
}
