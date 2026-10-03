import { FC, lazy, Suspense } from "react";
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

const descriptions = new Map<string, ReturnType<typeof lazy<FC<TProps>>>>();

const getDescription = __SCICHART_LAZY_EXAMPLES__
    ? (example: TExamplePage) => {
          if (!descriptions.has(example.id)) {
              const directory = example.exampleDirectory.replace(/^(\.\.\/)+Examples\//, "");
              descriptions.set(
                  example.id,
                  lazy(async () => {
                      const info = await import(`../Examples/${directory}/exampleInfo.tsx?description`);
                      return { default: (props: TProps) => <Description {...props} currentExample={info.default} /> };
                  })
              );
          }
          return descriptions.get(example.id);
      }
    : undefined;

const Description: FC<TProps> = (props) => {
    const { currentExample, selectedFramework } = props;
    return (
        <div
            id="EXAMPLE_MARKDOWN_CONTENT"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                color: "var(--text)",
            }}
            className={classes.MARKDOWN_CONTENT}
        >
            <ReactMarkdown rehypePlugins={plugins}>
                {getFrameworkContent(currentExample.markdownContent, selectedFramework)}
            </ReactMarkdown>
        </div>
    );
};

const MarkdownContent: FC<TProps> = (props) => {
    if (!__SCICHART_LAZY_EXAMPLES__) return <Description {...props} />;
    const Content = getDescription(props.currentExample);
    return (
        <Suspense fallback={<p role="status">Loading description…</p>}>
            <Content {...props} />
        </Suspense>
    );
};

export default MarkdownContent;
