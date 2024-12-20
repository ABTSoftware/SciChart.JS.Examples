import { FC, useContext, useEffect, useState } from "react";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { EPageLayout, GalleryItem } from "../../helpers/types/types";
import { TExamplePage } from "../AppRouter/examplePages";
import { ALL_MENU_ITEMS, MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
import { ExampleBreadcrumbs } from "../Breadcrumbs/ExampleBreadcrumbs";
import DrawerContent from "../DrawerContent/DrawerContent";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import GalleryItems from "../GalleryItems";
import classes from "./AppDetailsRouter.scss";
import MarkdownContent from "./MarkdownContent";
import { CodeSandbox } from "../CodeSandbox";
import { StackblitzEditor } from "../CodeSandbox/StackblitzEditor";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { CodeActionButtons } from "./CodeActionButtons";
import { CodeEditor } from "./CodeEditor";

type TProps = {
    currentExample: TExamplePage;
    isIFrame?: boolean;
    seeAlso: GalleryItem[];
};

const AppDetailsRouter: FC<TProps> = (props) => {
    const { currentExample, seeAlso } = props;
    
    const loadingFile = { name: "drawExample.ts", content: "// Loading ... " };
    const [sourceFiles, setSourceFiles] = useState<{ name: string; content: string }[]>([loadingFile]);
    const [selectedFile, setSelectedFile] = useState<{ name: string; content: string }>(loadingFile);

    const [pageLayout, setPageLayout] = useState<EPageLayout>(currentExample.pageLayout ?? EPageLayout.Default);
    const [embedCode, setEmbedCode] = useState<boolean>(false);
    const [sandboxPlatform, setSandboxPlatform] = useState<SandboxPlatform>(SandboxPlatform.CodeSandbox);
    const [sandboxId, setSandboxId] = useState<string>("");
    const [projectFiles, setProjectFiles] = useState<any>(null);
    const [sourceFramework, setSourceFramework] = useState<EPageFramework | null>(null);
    const [sandboxFramework, setSandboxFramework] = useState<EPageFramework | null>(null);

    const selectedFramework = useContext(FrameworkContext);
    const pageTitle = getFrameworkContent(currentExample.title, selectedFramework);

    let initialOpenedMenuItems = {
        MENU_ITEMS_FEATURED_APPS_ID: true,
        MENU_ITEMS_3D_ID: true,
        MENU_ITEMS_2D_ID: true,
    };

    MENU_ITEMS_FEATURED_APPS.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.id]: true };
    });
    MENU_ITEMS_3D.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.id]: true };
    });
    MENU_ITEMS_2D.forEach((item) => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.id]: true };
    });

    const [openedMenuItems, setOpenedMenuItems] = useState<Record<string, boolean>>(initialOpenedMenuItems);

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

        fetch("/source/" + currentExample.path + "?framework=" + selectedFramework)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((json: { files: { name: string; content: string }[]; framework: EPageFramework }) => {
                let defaultFile = json.files.find((f) => f.name === "drawExample.ts");
                if (!defaultFile) {
                    defaultFile = json.files[json.files.length - 1];
                }
                setSelectedFile({ name: defaultFile.name, content: defaultFile.content });
                setSourceFiles(json.files);
                setSourceFramework(json.framework);
            });
    }, [currentExample, selectedFramework]);

    useEffect(() => {
        if (embedCode) {
            setEmbedCode(false);
            setProjectFiles(null);
            setSandboxFramework(null);
        }
    }, []);

    const handleFileClick = (fileName: string) => {
        const file = sourceFiles.find((f) => f.name.includes(fileName));
        setSelectedFile({ name: file.name, content: file.content });
    };

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];
    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);

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

    const LayoutButtons = () => {
        return (
            <ul className={classes.layoutButtons}>
                <li
                    onClick={() => setPageLayout(EPageLayout.Default)}
                    className={pageLayout === EPageLayout.Default ? classes.active : ""}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <rect x="1.3" y="1.3" width="10" height="21.4" stroke="none" rx="2" />
                        <rect x="12.7" y="1.3" width="10" height="21.4" stroke="none" rx="2" />
                    </svg>
                </li>

                <li
                    onClick={() => setPageLayout(EPageLayout.MaxWidth)}
                    className={pageLayout === EPageLayout.MaxWidth ? classes.active : ""}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <rect x="1.3" y="1.3" width="21.4" height="10" stroke="none" rx="2" />
                        <rect x="1.3" y="12.7" width="21.4" height="10" stroke="none" rx="2" />
                    </svg>
                </li>
            </ul>
        );
    };

    return (
        <div>
            <div className={classes.mainWrapper}>
                <div className={classes.DrawerDesktop}>
                    <DrawerContent
                        testIsOpened={testIsOpened}
                        toggleOpenedMenuItem={toggleOpenedMenuItem}
                        toggleDrawer={() => {}}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 15, width: "100%" }}>
                    <div className={classes.contentwrapper}>
                        <div style={{ display: "flex" }}>
                            <ExampleBreadcrumbs />

                            <LayoutButtons />
                        </div>

                        <div style={{ display: "flex", justifyContent: 'center'}}>
                            <h1
                                className={classes.headingtxt}
                                style={{
                                    margin: "-10px 0",
                                    marginInline: pageLayout === EPageLayout.MaxWidth ? "auto" : 0,
                                    width: pageLayout === EPageLayout.MaxWidth ? "min(100vh , 100%)" : "auto",
                                }}
                            >
                                {pageTitle}
                            </h1>

                            {/* Github, stackblitz buttons visible on maxwidth layout */}
                            {!(pageLayout === EPageLayout.MaxWidth) ? (
                                <CodeActionButtons
                                    className={`${classes.tabbtnwrap} ${classes.hiddenSmall}`}
                                    {...{ currentExample, selectedFramework, selectedFile }}
                                    onSandboxOpen={handleSandboxOpen}
                                    style={{ marginLeft: "auto" }}
                                />
                            ) : null}
                        </div>

                        {/* Subtitle // this returns a <p> already */}
                        <span
                            style={
                                pageLayout === EPageLayout.MaxWidth
                                    ? { width: "100%", maxWidth: "min(100vh, 100vw)", margin: "0 auto", textAlign: "start" }
                                    : {}
                            }
                        >
                            {currentExample.subtitle(selectedFramework)}
                        </span>

                        {/* Main example section */}
                        {embedCode ? (
                            renderEditor()
                        ) : (
                            <div // Chart + Code section
                                className={classes.dynamicFlexWrapper}
                                style={pageLayout === EPageLayout.MaxWidth ? { flexDirection: "column" } : {}}
                            >
                                <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />
                                <CodeActionButtons
                                    {...{ currentExample, selectedFramework, selectedFile }}
                                    onSandboxOpen={handleSandboxOpen}
                                    className={`${classes.tabbtnwrap} ${
                                        pageLayout === EPageLayout.MaxWidth ? "" : classes.hiddenLarge
                                    }`}
                                    style={{ minHeight: 35, height: 35, padding: 0, width: "100%" }}
                                />
                                <CodeEditor
                                    files={sourceFiles}
                                    selectedFile={selectedFile}
                                    handleFileClick={handleFileClick}
                                    desiredFramework={selectedFramework}
                                    actualFramework={sourceFramework}
                                    examplePath={currentExample.path}
                                />
                            </div>
                        )}

                        {currentExample?.markdownContent?.length ? (
                            <MarkdownContent selectedFramework={selectedFramework} currentExample={currentExample} />
                        ) : null}
                    </div>
                    <GalleryItems examples={seeAlso} />
                </div>
            </div>
        </div>
    );
};

export default AppDetailsRouter;
