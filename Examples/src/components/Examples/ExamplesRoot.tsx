import { useRef, useContext, FC, useState, useEffect } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRoot: FC<TProps> = (props) => {
    const [render, setRender] = useState(false);
    const { examplePage, seeAlso } = props;
    const [showSource, setShowSource] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const framework = useContext(FrameworkContext);
    const frameworkName = FRAMEWORK_NAME[framework];
    const myRef = useRef(null);
    const executeScroll = () => myRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    const ExampleComponent = getExampleComponent(examplePage.id);
    // const ChartComponent = getExampleComponent(examplePage.id);

    const titleText = examplePage
        ? getTitle(examplePage.title, framework)
        : ExampleStrings.siteHomeTitle(frameworkName);
    const seoTitleText = getTitle(examplePage.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix;
    const subtitleText = examplePage ? examplePage.subtitle(frameworkName) : undefined;

    const documentationLinks = examplePage ? examplePage.documentationLinks : undefined;
    const tips = examplePage ? examplePage.tips : undefined;
    const previewDescription = examplePage ? examplePage.previewDescription : undefined;
    const description = examplePage ? examplePage.description : undefined;

    const githubUrl = examplePage ? "/components/Examples/" + examplePage.filepath : "";
    const seoDescription = examplePage ? getTitle(examplePage.metaDescription, framework) : "";
    const seoKeywords = examplePage ? examplePage.metaKeywords : "";
    const basePath = "https://demo.scichart.com";
    const exampleImage = examplePage ? `${basePath}/${examplePage.thumbnailImage}` : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    useEffect(() => {
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

    useEffect(() => {
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
                                    href={`https://scichart.com/example/javascript-chart/${exampleUrl}/`}
                                    title={titleText}
                                >
                                    {titleText}
                                </a>{" "}
                                is part of the SciChart.js demo app. To clone the repo for this demo, visit{" "}
                                <a
                                    className={classes.ExampleRootDescriptionLink}
                                    target="_blank"
                                    rel="external"
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
                                    href={`/codesandbox/${exampleUrl}?codesandbox=1`}
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
                                            href={`/iframe/${examplePage.path}`}
                                            title="View this example in Full Screen"
                                            target="_blank"
                                            rel="nofollow"
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
