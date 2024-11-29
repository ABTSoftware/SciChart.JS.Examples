import GitHubIcon from "@mui/icons-material/GitHub";
import SubdirectoryArrowRight from "@mui/icons-material/SubdirectoryArrowRight";
import { Button } from "@mui/material";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Simulate } from "react-dom/test-utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { baseGithubPath } from "../../constants";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { FRAMEWORK_NAME, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { GalleryItem } from "../../helpers/types/types";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { TExamplePage } from "../AppRouter/examplePages";
import { getExampleComponent } from "../AppRouter/examples";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import GalleryItems from "../GalleryItems";
import SeoTags from "../SeoTags/SeoTags";
import { ExampleStrings } from "./ExampleStrings";
import commonClasses from "./styles/Examples.module.scss";

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
        ? getFrameworkContent(examplePage.title, framework)
        : ExampleStrings.siteHomeTitle(frameworkName);
    const seoTitleText =
        getFrameworkContent(examplePage.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix;
    const subtitleText = examplePage ? examplePage.subtitle(frameworkName) : undefined;

    const documentationLinks = examplePage ? examplePage.documentationLinks : undefined;

    const githubUrl = examplePage ? "/components/Examples/" + examplePage.filepath : "";
    const seoDescription = examplePage ? getFrameworkContent(examplePage.metaDescription, framework) : "";
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
        <div className={commonClasses.ExamplesRoot}>
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
            />
            <div className={commonClasses.Body}>
                <div className={commonClasses.ColMain}>
                    <ComponentWrapper>
                        <div className={commonClasses.ExampleRootDescription}>
                            <h5>SciChart.js Demo</h5>

                            <p className={commonClasses.ExampleDescriptionText}>
                                {" "}
                                <a
                                    className={commonClasses.ExampleRootDescriptionLink}
                                    target="_blank"
                                    href={`https://scichart.com/example/javascript-chart/javascript-${exampleUrl}/`}
                                    title={titleText}
                                >
                                    {titleText}
                                </a>{" "}
                                is part of the SciChart.js demo app. To clone the repo for this demo, visit{" "}
                                <a
                                    className={commonClasses.ExampleRootDescriptionLink}
                                    target="_blank"
                                    rel="external"
                                    href="https://github.com/abtsoftware/scichart.js.examples"
                                    title={titleText}
                                >
                                    SciChart's Github
                                </a>
                                . For getting-started &amp; docs, see above!{" "}
                                <a
                                    className={commonClasses.ExampleRootDescriptionLink}
                                    target="_blank"
                                    rel="nofollow external"
                                    href={`/codesandbox/${exampleUrl}?codesandbox=1&framework=${framework}`}
                                >
                                    Open in CodeSandBox
                                </a>
                            </p>
                        </div>
                    </ComponentWrapper>

                    <ComponentWrapper>
                        <h1 className={commonClasses.Title}>{titleText} </h1>

                        <div className={commonClasses.ExampleWrapper}>
                            <div className={commonClasses.Example}>
                                <ExampleComponent />
                                <div className={commonClasses.ButtonsWrapper}>
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
                                    {/*    <span className={commonClasses.ButtonsText}>VIEW SOURCE CODE</span>*/}
                                    {/*</Button>*/}
                                    <Button className={commonClasses.GitHubLink}>
                                        <GitHubIcon />
                                        <a
                                            href={fullGithubUrl}
                                            title={fullGithubUrl}
                                            target="_blank"
                                            className={commonClasses.ButtonsText}
                                        >
                                            VIEW SOURCE IN GITHUB
                                        </a>
                                    </Button>
                                    <Button className={commonClasses.GitHubLink}>
                                        <SubdirectoryArrowRight />
                                        <a
                                            href={`/iframe/${examplePage.path}`}
                                            title="View this example in Full Screen"
                                            target="_blank"
                                            rel="nofollow"
                                            className={commonClasses.ButtonsText}
                                        >
                                            VIEW Full Screen
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ComponentWrapper>

                    {seeAlso && (
                        <div className={!showSource && !firstRender ? commonClasses.Animation : ""}>
                            <GalleryItems examples={seeAlso} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamplesRoot;
