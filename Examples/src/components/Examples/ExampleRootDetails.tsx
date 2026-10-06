import { FC, useEffect } from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/getExampleComponent";
import { ExampleStrings } from "./ExampleStrings";
import "./styles/examples-shell.css";
import { GalleryItem } from "../../helpers/types/types";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { _useContext } from "../../helpers/shared/Helpers/Context";

type TProps = {
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRootDetails: FC<TProps> = (props) => {
    const { examplePage } = props;
    const { state } = _useContext();
    const framework = state.framework;
    const ExampleComponent = getExampleComponent(examplePage.id);

    const seoPrefixTitle = getFrameworkContent(examplePage.pageTitle, framework);
    const seoTitleText = seoPrefixTitle + ExampleStrings.exampleGenericTitleSuffix(framework, seoPrefixTitle.length);

    const seoDescription = examplePage ? getFrameworkContent(examplePage.metaDescription, framework) : "";
    const seoKeywords = examplePage
        ? examplePage.metaKeywords
        : "chart, data, javascript, webassembly, scichart, react";
    const exampleImage = examplePage ? examplePage.thumbnailImage : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
    }, []);
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
            <div className="sc-example AnExampleContainer h-full">
                <ExampleComponent />
            </div>
        </div>
    );
};

export default ExamplesRootDetails;
