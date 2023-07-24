import * as React from "react";

type TProps = {
    children: React.ReactNode;
};

export default function Carousel(props: TProps) {
    return <div>{props.children}</div>;
}
