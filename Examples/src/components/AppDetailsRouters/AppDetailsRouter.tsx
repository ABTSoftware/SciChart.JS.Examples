import { baseAppPath } from "../../constants";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { EPageLayout, ExampleSourceFile } from "../../helpers/types/types";
import DrawerContent from "../DrawerContent/DrawerContent";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import GalleryItems from "../GalleryItems";
import MarkdownContent from "./MarkdownContent";
import { CodeSandbox } from "../CodeSandbox";
import { StackblitzEditor } from "../CodeSandbox/StackblitzEditor";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { CodeActionButtons } from "./CodeActionButtons";
import { CodePreview } from "../CodePreview/CodePreview";
import { ExamplesSubtitle } from "./ExamplesSubtitle";
import { SourceFilesContext } from "./SourceFilesLoading/SourceFilesContext";
import type { StackBlitzResponse } from "../../helpers/types/types";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";
import { getSeeAlsoGalleryItems } from "../../helpers/SciChartExamples";
import { ExampleBreadcrumbs } from "../Breadcrumbs/ExampleBreadcrumbs";

const AppDetailsRouter: FC<{
    isExampleNavigationOpen: boolean;
    isNarrowViewport: boolean;
    toggleExampleNavigation: () => void;
}> = ({
    isExampleNavigationOpen,
    isNarrowViewport,
    toggleExampleNavigation,
}) => {
    const { state } = _useContext();
    const { currentExample, framework: selectedFramework } = state;
    const seeAlso = currentExample.seeAlso ?? getSeeAlsoGalleryItems(ALL_MENU_ITEMS, currentExample, selectedFramework);
    const pageTitle = getFrameworkContent(currentExample.title, selectedFramework);

    const initialSourceFilesVariant = useContext(SourceFilesContext);
    const [sourceFiles, setSourceFiles] = useState<ExampleSourceFile[]>(initialSourceFilesVariant.files);
    const [pageLayout, setPageLayout] = useState<EPageLayout>(currentExample.pageLayout ?? EPageLayout.Default);
    const exampleNavigationRef = useRef<HTMLDivElement>(null);
    const previousNavigationOpen = useRef(isExampleNavigationOpen);
    const [embedCode, setEmbedCode] = useState<boolean>(false);
    const [sandboxPlatform, setSandboxPlatform] = useState<SandboxPlatform>(SandboxPlatform.CodeSandbox);
    const [sandboxId, setSandboxId] = useState<string>("");
    const [projectFiles, setProjectFiles] = useState<StackBlitzResponse>(null);
    const [sourceFramework, setSourceFramework] = useState<EPageFramework | null>(initialSourceFilesVariant.framework);
    const [sandboxFramework, setSandboxFramework] = useState<EPageFramework | null>(null);

    useEffect(() => {
        setPageLayout(currentExample.pageLayout ?? EPageLayout.Default);
        window.scrollTo({
            top: 0,
        });
        // Reset sandbox state when example changes
        setEmbedCode(false);
        setSandboxId("");
        setProjectFiles(null);
        setSandboxFramework(null);

        const controller = new AbortController();
        fetch(`${baseAppPath}/source/${currentExample.path}?framework=${selectedFramework}`, {
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((json: { files: { name: string; content: string }[]; framework: EPageFramework }) => {
                setSourceFiles(json.files);
                setSourceFramework(json.framework);
            })
            .catch((error) => {
                if (error.name !== "AbortError") console.error("Unable to load example source", error);
            });
        return () => controller.abort();
    }, [currentExample, selectedFramework]);

    useEffect(() => {
        const navigationChanged = previousNavigationOpen.current !== isExampleNavigationOpen;
        previousNavigationOpen.current = isExampleNavigationOpen;
        if (!navigationChanged) return;
        requestAnimationFrame(() => {
            if (isExampleNavigationOpen && isNarrowViewport) {
                exampleNavigationRef.current?.querySelector<HTMLElement>("a, button")?.focus();
            }
        });
    }, [isExampleNavigationOpen, isNarrowViewport]);

    const handleBack = () => {
        setEmbedCode(false);
        setSandboxId("");
        setProjectFiles(null);
        setSandboxFramework(null);
    };

    const handleSandboxOpen = (platform: SandboxPlatform, id: string, files?: any, framework?: EPageFramework) => {
        setSandboxPlatform(platform);
        setSandboxId(id);
        if (files) {
            setProjectFiles(files);
        }
        if (framework) {
            setSandboxFramework(framework);
        }
        setEmbedCode(true);
    };

    const renderEditor = () => {
        return sandboxPlatform === SandboxPlatform.CodeSandbox ? (
            <CodeSandbox
                id={sandboxId}
                onBack={handleBack}
                platform={sandboxPlatform}
                exampleName={pageTitle}
                desiredFramework={selectedFramework}
                actualFramework={sandboxFramework || selectedFramework}
            />
        ) : (
            <StackblitzEditor id={sandboxId} onBack={handleBack} exampleName={pageTitle} projectFiles={projectFiles} />
        );
    };

    return (
        <div className={`sc-app-details-layout ${isExampleNavigationOpen ? "sc-app-details-nav-open" : ""}`}>
            <div
                id="EXAMPLE_NAVIGATION"
                className="sc-app-details-drawer"
                ref={exampleNavigationRef}
                aria-hidden={!isExampleNavigationOpen}
                inert={!isExampleNavigationOpen}
            >
                <DrawerContent />
            </div>
            {isExampleNavigationOpen && (
                <button
                    className="sc-app-details-nav-backdrop"
                    type="button"
                    onClick={toggleExampleNavigation}
                    aria-label="Close example navigation"
                />
            )}
            <div className="sc-app-details-main" inert={isNarrowViewport && isExampleNavigationOpen}>
                <div
                    id="EXAMPLE_CONTENT_WRAPPER"
                    className="sc-app-details-content"
                    data-layout={pageLayout}
                    data-sandbox-open={embedCode ? "" : undefined}
                >
                    <div className="sc-app-details-header">
                        <div className="sc-app-details-header-actions">
                            <ExampleBreadcrumbs />

                            <div
                                className="sc-button-group sc-app-layout-buttons"
                                role="group"
                                aria-label="Example layout"
                            >
                                <button
                                    type="button"
                                    className="sc-button sc-button-icon"
                                    onClick={() => setPageLayout(EPageLayout.Default)}
                                    aria-label="Side by side layout"
                                    title="Side by side layout"
                                    aria-pressed={pageLayout === EPageLayout.Default}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M12 3v18" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="sc-button sc-button-icon"
                                    onClick={() => setPageLayout(EPageLayout.MaxWidth)}
                                    aria-label="Stacked layout"
                                    title="Stacked layout"
                                    aria-pressed={pageLayout === EPageLayout.MaxWidth}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 12h18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <h1 id="EXAMPLE_TITLE">{pageTitle}</h1>

                        <ExamplesSubtitle
                            content={currentExample.subtitle(selectedFramework)}
                            alsoKnownAs={currentExample?.alsoKnownAs}
                        />
                    </div>

                    {/* Main example section */}
                    {embedCode ? (
                        renderEditor()
                    ) : (
                        <div className="sc-app-chart-code">
                            <ExamplesRoot />
                            <CodeActionButtons onSandboxOpen={handleSandboxOpen} className="sc-editor-actions" />
                            <CodePreview
                                key={`${currentExample.path}:${sourceFramework}`}
                                files={sourceFiles}
                                desiredFramework={selectedFramework}
                                actualFramework={sourceFramework}
                                examplePath={currentExample.path}
                            />
                        </div>
                    )}
                    <MarkdownContent />
                </div>
                <GalleryItems examples={seeAlso} needsH1={false} />
            </div>
        </div>
    );
};

export default AppDetailsRouter;
