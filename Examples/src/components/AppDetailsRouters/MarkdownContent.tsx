import { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TExamplePage } from "../AppRouter/examplePages";
import classes from "../../assets/main.scss";

type TProps = {
    currentExample: TExamplePage;
    selectedFramework: EPageFramework;
};

const plugins = [rehypeRaw as any];

const MarkdownContent: FC<TProps> = (props) => {
    const { currentExample, selectedFramework } = props;
    return (
        <div
            id="EXAMPLE_MARKDOWN_CONTENT"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
            }}
            className={classes.MARKDOWN_CONTENT}
        >
            <ReactMarkdown rehypePlugins={plugins}>
                {getFrameworkContent(currentExample.markdownContent, selectedFramework)}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownContent;
