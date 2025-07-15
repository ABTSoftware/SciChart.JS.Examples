import React, { FC, ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import classes from "./ExamplesSubtitle.scss";

type TSubtitleProps = {
    content: ReactElement | string;
    isMaxWidth?: boolean;
};

export const ExamplesSubtitle: FC<TSubtitleProps> = ({ content, isMaxWidth }) => {
    const className = `${classes.subtitle} ${isMaxWidth ? classes.maxWidth : ""}`;

    if (typeof content === "string") {
        return (
            <span 
                id="EXAMPLE_SUBTITLE"
                className={className}
            >
                <ReactMarkdown>{content}</ReactMarkdown>
            </span>
        );
    }

    return <span className={className}>{content}</span>;
};
