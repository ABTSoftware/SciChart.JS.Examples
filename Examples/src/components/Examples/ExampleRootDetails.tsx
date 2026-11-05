import { FC, useEffect } from "react";
import SeoTags from "../SeoTags/SeoTags";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/getExampleComponent";
import { ExampleStrings } from "./ExampleStrings";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { _useContext } from "../../helpers/shared/Helpers/Context";

const ExamplesRootDetails: FC = () => {
    const {
        state: { currentExample: examplePage, framework },
    } = _useContext();
    const ExampleComponent = getExampleComponent(examplePage.id);

    const seoPrefixTitle = getFrameworkContent(examplePage.pageTitle, framework);
    const seoTitleText = seoPrefixTitle + ExampleStrings.exampleGenericTitleSuffix(framework, seoPrefixTitle);

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
        <div className="sc-app-example-root">
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
                framework={framework}
            />
            <div className="sc-app-example">
                <ExampleComponent />
            </div>
        </div>
    );
};

export default ExamplesRootDetails;
