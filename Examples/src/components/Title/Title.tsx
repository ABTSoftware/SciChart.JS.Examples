import * as React from "react";

type TProps = {
    title: string;
    subtitle?: string;
};

const Title: React.FC<TProps> = (props) => {
    return (
        <React.Fragment>
            <h1 className="sc-app-title">{props.title}</h1>
            {props.subtitle && (
                <div style={{ maxWidth: "50rem", marginBottom: "1.25rem" }}>
                    <h3 className="sc-app-subtitle">{props.subtitle}</h3>
                </div>
            )}
        </React.Fragment>
    );
};

export default Title;
