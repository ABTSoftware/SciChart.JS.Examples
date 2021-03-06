import * as React from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/examples";
import Button from "@material-ui/core/Button";
import { ExampleStrings } from "./ExampleStrings";
import classes from "./Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import SourceCode from "../SourceCode/SourceCode";
import CodeIcon from "@material-ui/icons/Code";
import GitHubIcon from "@material-ui/icons/GitHub";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Gallery from "../Gallery/Gallery";
import { GalleryItem } from "../../helpers/types/types";
import ExampleDescription from "../ExampleDescription/ExampleDescription";
type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
};

const ExamplesRoot: React.FC<TProps> = props => {
    const [render, setRender] = React.useState(false);
    const { examplePage } = props;
    const [showSource, setShowSource] = React.useState(false);
    const [firstRender, setFirstRender] = React.useState(true);

    const myRef = React.useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView({ block: "center", behavior: "smooth" });

    const ExampleComponent = getExampleComponent(examplePage.id);

    const titleText = examplePage ? examplePage.title : ExampleStrings.siteHomeTitle;
    const seoTitleText = titleText + ExampleStrings.exampleTitleSuffix;
    const subtitleText = examplePage ? examplePage.subtitle() : undefined;

    const documentationLinks = examplePage ? examplePage.documentationLinks : undefined;
    const tips = examplePage ? examplePage.tips : undefined;
    const previewDescription = examplePage ? examplePage.previewDescription : undefined;
    const description = examplePage ? examplePage.description : undefined;

    const seeAlso: GalleryItem[] = examplePage?.seeAlso;
    const codeStr = examplePage ? examplePage.code : "";
    const githubUrl = examplePage ? examplePage.githubUrl : "";
    const seoDescription = examplePage ? examplePage.seoDescription : "";
    const seoKeywords = examplePage ? examplePage.seoKeywords : "";
    const basePath = process.env.PUBLIC_URL ?? "https://demo.scichart.com";
    const exampleImage = examplePage ? `${basePath}/images/${examplePage.thumbnailImage}` : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    React.useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        window.Prism.highlightAll();
    }, []);
    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const fullGithubUrl = baseGithubPath + githubUrl;

    React.useEffect(() => {
        setRender(true);
        return () => {
            setRender(false);
        };
    }, []);
    return (
        <div className={classes.ExamplesRoot}>
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
            />
            <div className={classes.Body}>
                <div className={classes.ColMain}>
                    <ComponentWrapper>
                        <div className={classes.ExampleRootDescription}>
                            <h5>JavaScript Chart Examples</h5>

                            <p className={classes.ExampleDescriptionText}>
                                SciChart.js ships with ~40{" "}
                                <a className={classes.ExampleRootDescriptionLink} href="https://demo.scichart.com">
                                    JavaScript Chart Examples
                                </a>{" "}
                                which you can browse, play with, view the source code and see related documentation. All
                                of this is possible with the SciChart.js Examples Suite, which ships as part of the{" "}
                                <a
                                    className={classes.ExampleRootDescriptionLink}
                                    href="https://www.scichart.com/downloads"
                                >
                                    SciChart.js SDK
                                </a>
                            </p>
                            <div className={classes.OrangeButton}>
                                <Button href="https://www.scichart.com/downloads/" target="_blank">
                                    Download the SDK
                                </Button>
                            </div>
                        </div>
                    </ComponentWrapper>

                    <ComponentWrapper>
                        <h1 className={classes.Title}>{titleText} </h1>

                        <div className={classes.ExampleWrapper}>
                            <div className={classes.Example}>
                                <CSSTransition timeout={1500} in={render} mountOnEnter classNames="example-anim">
                                    <ExampleComponent />
                                </CSSTransition>{" "}
                                <div className={classes.ButtonsWrapper}>
                                    <Button
                                        onClick={() => {
                                            setShowSource(!showSource);
                                            setFirstRender(false);
                                            if (!showSource) {
                                                executeScroll();
                                            }
                                        }}
                                    >
                                        <CodeIcon />
                                        <span className={classes.ButtonsText}>VIEW SOURCE CODE</span>
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowSource(!showSource);
                                        }}
                                    >
                                        <GitHubIcon />
                                        <a href={fullGithubUrl} target="_blank" className={classes.ButtonsText}>
                                            VIEW IN GITHUB
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className={classes.ExampleDescription}>
                                <div className={classes.Subtitle}>{subtitleText}</div>
                                <ExampleDescription
                                    documentationLinks={documentationLinks}
                                    tips={tips}
                                    description={description}
                                    previewDescription={previewDescription}
                                />
                            </div>
                        </div>
                    </ComponentWrapper>

                    <div ref={myRef}>
                        <CSSTransition timeout={1000} unmountOnExit in={showSource} classNames="source-code">
                            <ComponentWrapper>
                                {examplePage && (
                                    <SourceCode
                                        onClose={() => {
                                            setShowSource(false);
                                        }}
                                        code={codeStr}
                                        githubUrl={githubUrl}
                                    />
                                )}
                            </ComponentWrapper>
                        </CSSTransition>
                    </div>

                    {seeAlso && (
                        <div className={!showSource && !firstRender ? classes.Animation : ""}>
                            <Gallery examples={seeAlso} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamplesRoot;
