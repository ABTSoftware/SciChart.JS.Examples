import { useContext, FC, useState, useEffect } from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/examples";
import { ExampleStrings } from "./ExampleStrings";
import commonClasses from "./styles/Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../helpers/types/types";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRootDetails: FC<TProps> = (props) => {
    const { examplePage, seeAlso } = props;
    const framework = useContext(FrameworkContext);
    const ExampleComponent = getExampleComponent(examplePage.id);
    const seoTitleText =
        getFrameworkContent(examplePage.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix;
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
    return (
        <div className={commonClasses.ExamplesRoot}>
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
            />
            <div className={`${commonClasses.Example} AnExampleContainer`} style={{height: '100%'}}>
                <ExampleComponent />
                {/* view fullscreen */}
                <a
                    style={{ position: "absolute", right: 15, bottom: 5, zIndex: 100 }}
                    href={`/iframe/${examplePage.path}`}
                    target="_blank"
                >
                    <svg
                        style={{ width: 24, height: 24 }}
                        stroke="#FFFFFF"
                        fill="#FFFFFF"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                    >
                        <path d="M12 3H6.67C4.65 3 3 4.64 3 6.67V12c0 .55.45 1 1 1s1-.45 1-1V6.67C5 5.75 5.75 5 6.67 5H12c.55 0 1-.45 1-1S12.55 3 12 3zM12 27H6.67C5.75 27 5 26.25 5 25.33V20c0-.55-.45-1-1-1s-1 .45-1 1v5.33C3 27.36 4.65 29 6.67 29H12c.55 0 1-.45 1-1S12.55 27 12 27zM28 19c-.55 0-1 .45-1 1v5.33c0 .92-.75 1.67-1.67 1.67H20c-.55 0-1 .45-1 1s.45 1 1 1h5.33c2.02 0 3.67-1.64 3.67-3.67V20C29 19.45 28.55 19 28 19zM25.33 3H20c-.55 0-1 .45-1 1s.45 1 1 1h5.33C26.25 5 27 5.75 27 6.67V12c0 .27.1.52.29.71.04.03.08.05.13.08C27.58 12.91 27.78 13 28 13c.22 0 .42-.09.59-.21.04-.03.09-.04.12-.08.03-.04.05-.08.08-.12C28.91 12.42 29 12.22 29 12V6.67C29 4.64 27.35 3 25.33 3z"></path>
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default ExamplesRootDetails;
