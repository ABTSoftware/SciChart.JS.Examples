import * as React from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { ALL_MENU_ITEMS, getExampleComponent } from "../AppRouter/examples";
import Button from "@material-ui/core/Button";
import { ExampleStrings } from "./ExampleStrings";
import classes from "./styles/Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import GitHubIcon from "@material-ui/icons/GitHub";
import Gallery from "../Gallery/Gallery";
import { GalleryItem } from "../../helpers/types/types";
import ExampleDescription from "../ExampleDescription/ExampleDescription";
import { Simulate } from "react-dom/test-utils";
import submit = Simulate.submit;
import { Radio, SubdirectoryArrowRight } from "@material-ui/icons";
import { InfoToolbar } from "./Toolbar";
import { baseGithubPath } from "../../constants";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRoot: React.FC<TProps> = props => {
    const [render, setRender] = React.useState(false);
    const { examplePage, seeAlso } = props;
    const [showSource, setShowSource] = React.useState(false);
    const [firstRender, setFirstRender] = React.useState(true);

    const myRef = React.useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    const ExampleComponent = getExampleComponent(examplePage.id);
    // const ChartComponent = getExampleComponent(examplePage.id);

    const titleText = examplePage ? examplePage.title : ExampleStrings.siteHomeTitle;
    const seoTitleText = examplePage.pageTitle;
    const subtitleText = examplePage ? examplePage.subtitle() : undefined;

    const documentationLinks = examplePage ? examplePage.documentationLinks : undefined;
    const tips = examplePage ? examplePage.tips : undefined;
    const previewDescription = examplePage ? examplePage.previewDescription : undefined;
    const description = examplePage ? examplePage.description : undefined;

    const githubUrl = examplePage ? examplePage.githubUrl : "";
    const seoDescription = examplePage ? examplePage.metaDescription : "";
    const seoKeywords = examplePage ? examplePage.metaKeywords : "";
    const basePath = "https://demo.scichart.com";
    const exampleImage = examplePage ? `${basePath}/${examplePage.thumbnailImage}` : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    React.useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        window.Prism?.highlightAll();
    }, []);
    const fullGithubUrl = baseGithubPath + githubUrl;

    // const ExampleComponent = () => {
    //     return (
    //         <div style={{ position: "relative" }}>
    //             <InfoToolbar examplePage={examplePage}></InfoToolbar>
    //             <ChartComponent></ChartComponent>
    //         </div>
    //     );
    // };

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
                            <h5>SciChart.js Demo</h5>

                            <p className={classes.ExampleDescriptionText}>
                                {" "}
                                <a
                                    className={classes.ExampleRootDescriptionLink}
                                    target="_blank"
                                    href={`https://scichart.com/example/javascript-chart${exampleUrl}/`}
                                    title={titleText}
                                >
                                    {titleText}
                                </a>{" "}
                                is part of the SciChart.js demo app. To clone the repo for this demo, visit{" "}
                                <a
                                    className={classes.ExampleRootDescriptionLink}
                                    target="_blank"
                                    rel="nofollow external"
                                    href="https://github.com/abtsoftware/scichart.js.examples"
                                    title={titleText}
                                >
                                    SciChart's Github
                                </a>
                                . For getting-started &amp; docs, see above!{" "}
                                <a
                                    className={classes.ExampleRootDescriptionLink}
                                    target="_blank"
                                    rel="nofollow external"
                                    href={`${exampleUrl}?codesandbox=1`}
                                >
                                    Open in CodeSandBox
                                </a>
                            </p>
                        </div>
                    </ComponentWrapper>

                    <ComponentWrapper>
                        <h1 className={classes.Title}>{titleText} </h1>

                        <div className={classes.ExampleWrapper}>
                            <div className={classes.ExampleDescription}>
                                <div className={classes.Subtitle}>{subtitleText}</div>
                                <ExampleDescription
                                    documentationLinks={documentationLinks}
                                    tips={tips}
                                    description={description}
                                    previewDescription={previewDescription}
                                />
                            </div>
                            <div className={classes.Example}>
                                <ExampleComponent />
                                <div className={classes.ButtonsWrapper}>
                                    {/*<Button*/}
                                    {/*    onClick={() => {*/}
                                    {/*        setShowSource(!showSource);*/}
                                    {/*        setFirstRender(false);*/}
                                    {/*        if (!showSource) {*/}
                                    {/*            executeScroll();*/}
                                    {/*        }*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    <CodeIcon />*/}
                                    {/*    <span className={classes.ButtonsText}>VIEW SOURCE CODE</span>*/}
                                    {/*</Button>*/}
                                    <Button className={classes.GitHubLink}>
                                        <GitHubIcon />
                                        <a
                                            href={fullGithubUrl}
                                            title={fullGithubUrl}
                                            target="_blank"
                                            className={classes.ButtonsText}
                                        >
                                            VIEW SOURCE IN GITHUB
                                        </a>
                                    </Button>
                                    <Button className={classes.GitHubLink}>
                                        <SubdirectoryArrowRight />
                                        <a
                                            href={`/iframe${examplePage.path}`}
                                            title="View this example in Full Screen"
                                            target="_blank"
                                            className={classes.ButtonsText}
                                        >
                                            VIEW Full Screen
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ComponentWrapper>

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
