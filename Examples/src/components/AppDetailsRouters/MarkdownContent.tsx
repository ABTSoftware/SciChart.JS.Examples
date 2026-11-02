import { FC, lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import { TExamplePage } from "../AppRouter/examplePages";

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
        <div id="EXAMPLE_MARKDOWN_CONTENT" className="sc-content-markdown">
            <ReactMarkdown rehypePlugins={plugins}>
                {getFrameworkContent(currentExample.markdownContent, selectedFramework)}
            </ReactMarkdown>
        </div>
    );
};

const MarkdownContent: FC = () => {
    const {
        state: { currentExample, framework: selectedFramework },
    } = _useContext();
    const props = { currentExample, selectedFramework };
    if (!__SCICHART_LAZY_EXAMPLES__) return <Description {...props} />;
    const Content = getDescription(props.currentExample);
    return (
        <Suspense fallback={<p role="status">Loading description…</p>}>
            <Content {...props} />
        </Suspense>
    );
};

export default MarkdownContent;
