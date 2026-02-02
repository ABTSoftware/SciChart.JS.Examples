import React, { FC, ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import classes from "./ExamplesSubtitle.scss";
import MarkdownContent from "./MarkdownContent";
import rehypeRaw from "rehype-raw";

type TSubtitleProps = {
    content: ReactElement | string;
    isMaxWidth?: boolean;
    alsoKnownAs?: string
};

export const ExamplesSubtitle: FC<TSubtitleProps> = ({ content, isMaxWidth, alsoKnownAs }) => {
    const className = `${classes.subtitle} ${isMaxWidth ? classes.maxWidth : ""}`;
    const plugins = [rehypeRaw as any];
    if (typeof content === "string") {
        return (
            <span 
                id="EXAMPLE_SUBTITLE"
                className={className}
            >
                <ReactMarkdown>{content}</ReactMarkdown>
                {alsoKnownAs ?
                    <div className={classes.alsoKnownAs}>
                        <ReactMarkdown rehypePlugins={plugins}>
                            {alsoKnownAs}
                        </ReactMarkdown>
                    </div>
                : null}
            </span>
        );
    }

    return <span className={className}>{content}</span>;
};
