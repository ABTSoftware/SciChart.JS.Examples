import { useRef, useContext, FC, useState, useEffect } from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { ALL_MENU_ITEMS, getExampleComponent } from "../AppRouter/examples";
import { Button } from "@mui/material";
import { ExampleStrings } from "./ExampleStrings";
import commonClasses from "./styles/Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../helpers/types/types";
import ExampleDescription from "../ExampleDescription/ExampleDescription";
import { Simulate } from "react-dom/test-utils";
import submit = Simulate.submit;
import GitHubIcon from "@mui/icons-material/GitHub";
import Radio from "@mui/icons-material/Radio";
import SubdirectoryArrowRight from "@mui/icons-material/SubdirectoryArrowRight";
import { InfoToolbar } from "./Toolbar";
import { baseGithubPath } from "../../constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import GalleryItems from "../GalleryItems";

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
                            <div className={commonClasses.ExampleDescription}>
                                <div className={commonClasses.Subtitle}>{subtitleText}</div>
                                <ExampleDescription
                                    documentationLinks={documentationLinks}
                                    tips={tips}
                                    description={description}
                                    previewDescription={previewDescription}
                                />
                            </div>
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
