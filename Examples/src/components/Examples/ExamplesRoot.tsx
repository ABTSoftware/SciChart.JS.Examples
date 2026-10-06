import { GitHubIcon, SubdirectoryArrowRight } from "./icons";
import { FC, useEffect } from "react";
import { Link } from "react-router";
import { baseGithubPath } from "../../constants";
import { FRAMEWORK_NAME, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { GalleryItem } from "../../helpers/types/types";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { TExamplePage } from "../AppRouter/examplePages";
import { getExampleComponent } from "../AppRouter/getExampleComponent";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import GalleryItems from "../GalleryItems";
import SeoTags from "../SeoTags/SeoTags";
import { ExampleStrings } from "./ExampleStrings";
import "./styles/examples-shell.css";
import { _useContext } from "../../helpers/shared/Helpers/Context";

type TProps = {
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRoot: FC<TProps> = (props) => {
    const { examplePage, seeAlso } = props;
    const { state } = _useContext();
    const framework = state.framework;
    const frameworkName = FRAMEWORK_NAME[framework];
    const ExampleComponent = getExampleComponent(examplePage.id);

    const titleText = examplePage
        ? getFrameworkContent(examplePage.title, framework)
        : ExampleStrings.siteHomeTitle(frameworkName);

    const seoPrefixTitle = getFrameworkContent(examplePage.pageTitle, framework);
    const seoTitleText = seoPrefixTitle + ExampleStrings.exampleGenericTitleSuffix(framework, seoPrefixTitle.length);

    const githubUrl = examplePage ? "/components/Examples/" + examplePage.filepath : "";
    const seoDescription = examplePage ? getFrameworkContent(examplePage.metaDescription, framework) : "";
    const seoKeywords = examplePage ? examplePage.metaKeywords : "";
    const exampleImage = examplePage ? examplePage.thumbnailImage : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
    }, []);
    const fullGithubUrl = baseGithubPath + githubUrl;

    return (
        <div className="sc-examples-root">
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
                framework={framework}
            />
            <div className="sc-body">
                <div className="sc-col-main">
                    <ComponentWrapper>
                        <h1 className="sc-title">{titleText} </h1>

                        <div className="sc-example-wrapper">
                            <div className="sc-example">
                                <ExampleComponent />
                                <div className="sc-buttons-wrapper">
                                    <a
                                        className="sc-git-hub-link"
                                        href={fullGithubUrl}
                                        title={fullGithubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <GitHubIcon />
                                        <span className="sc-buttons-text">VIEW SOURCE IN GITHUB</span>
                                    </a>
                                    <Link
                                        className="sc-git-hub-link"
                                        to={`/iframe/${examplePage.path}`}
                                        title="View this example in Full Screen"
                                        target="_blank"
                                        rel="nofollow"
                                    >
                                        <SubdirectoryArrowRight />
                                        <span className="sc-buttons-text">VIEW Full Screen</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ComponentWrapper>

                    {seeAlso && <GalleryItems examples={seeAlso} setMostVisibleCategory={() => {}} />}
                </div>
            </div>
        </div>
    );
};

export default ExamplesRoot;
