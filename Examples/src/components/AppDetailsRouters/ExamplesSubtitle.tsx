import { FC, ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

type TSubtitleProps = {
    content: ReactElement | string;
    alsoKnownAs?: string;
};

export const ExamplesSubtitle: FC<TSubtitleProps> = ({ content, alsoKnownAs }) => {
    const plugins = [rehypeRaw as any];
    if (typeof content === "string") {
        return (
            <span id="EXAMPLE_SUBTITLE" className="sc-content-subtitle">
                <ReactMarkdown>{content}</ReactMarkdown>
                {alsoKnownAs ? (
                    <div className="sc-content-also-known-as">
                        <ReactMarkdown rehypePlugins={plugins}>{alsoKnownAs}</ReactMarkdown>
                    </div>
                ) : null}
            </span>
        );
    }

    return <span className="sc-content-subtitle">{content}</span>;
};
