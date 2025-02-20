import { FC, useContext, useEffect, useState } from "react";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { EPageLayout, ETheme, ExampleSourceFile, GalleryItem } from "../../helpers/types/types";
import { TExamplePage } from "../AppRouter/examplePages";
import { MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
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
import { CodePreview } from "../CodePreview/CodePreview";
import { ExamplesSubtitle } from "./ExamplesSubtitle";
import { SourceFilesContext } from "./SourceFilesLoading/SourceFilesContext";
import type { StackBlitzResponse } from "../../helpers/types/types";
import { ToolbarGroup } from "../buttons/Toolbar";
import { Tooltip } from "@mui/material";

type TProps = {
    currentExample: TExamplePage;
    isIFrame?: boolean;
    seeAlso: GalleryItem[];
    theme: ETheme;
};

const AppDetailsRouter: FC<TProps> = (props) => {
    const { currentExample, seeAlso, theme } = props;

    const initialSourceFilesVariant = useContext(SourceFilesContext);
    const getInitialSelectedFile = () =>
        initialSourceFilesVariant.files.find((file) => file.name.startsWith("drawExample")) ??
        initialSourceFilesVariant.files.find((file) => file.name.startsWith("index")) ??
        initialSourceFilesVariant.files[0];

    const [sourceFiles, setSourceFiles] = useState<ExampleSourceFile[]>(initialSourceFilesVariant.files);
    const [selectedFile, setSelectedFile] = useState<ExampleSourceFile>(getInitialSelectedFile);
    const [pageLayout, setPageLayout] = useState<EPageLayout>(EPageLayout.Default);
    const [isSideBySidePossible, setIsSideBySidePossible] = useState<boolean>();
    const [embedCode, setEmbedCode] = useState<boolean>(false);
    const [sandboxPlatform, setSandboxPlatform] = useState<SandboxPlatform>(SandboxPlatform.CodeSandbox);
    const [sandboxId, setSandboxId] = useState<string>("");
    const [projectFiles, setProjectFiles] = useState<StackBlitzResponse>(null);
    const [sourceFramework, setSourceFramework] = useState<EPageFramework | null>(initialSourceFilesVariant.framework);
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
        setIsSideBySidePossible(window.innerWidth > 1900);
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
        const handleResize = () => {
            setIsSideBySidePossible(window.innerWidth > 1900);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const isMaxWidth = pageLayout === EPageLayout.MaxWidth || !isSideBySidePossible;
    const md = getFrameworkContent(currentExample.markdownContent, selectedFramework);

    return (
        <div>
            <div className={classes.mainWrapper}>
                <div className={classes.DrawerDesktop}>
                    <DrawerContent
                        testIsOpened={testIsOpened}
                        toggleOpenedMenuItem={toggleOpenedMenuItem}
                        toggleDrawer={() => {}}
                        currentExample={currentExample}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 15, width: "100%" }}>
                    <div className={classes.contentwrapper}>
                        <div style={{ display: "flex" }}>
                            <ExampleBreadcrumbs />

                            <LayoutButtons />
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <h1
                                className={classes.headingtxt}
                                style={{
                                    margin: isMaxWidth ? "-10px 0" : 0,
                                    marginInline: isMaxWidth ? "auto" : 0,
                                    width: isMaxWidth ? "min(100vh , 100%)" : "auto",
                                }}
                            >
                                {pageTitle}
                            </h1>

                            {/* Github, stackblitz buttons visible on maxwidth layout */}
                            {!isMaxWidth ? (
                                <CodeActionButtons
                                    className={`${classes.tabbtnwrap} ${classes.hiddenSmall}`}
                                    {...{ currentExample, selectedFramework, selectedFile }}
                                    onSandboxOpen={handleSandboxOpen}
                                    style={{ marginLeft: "auto" }}
                                />
                            ) : null}
                        </div>

                        {/* Subtitle // this returns a <p> already */}
                        <ExamplesSubtitle
                            content={currentExample.subtitle(selectedFramework)}
                            isMaxWidth={isMaxWidth}
                        />

                        {/* Main example section */}
                        {embedCode ? (
                            renderEditor()
                        ) : (
                            <div // Chart + Code section
                                className={`${classes.dynamicFlexWrapper} ${isMaxWidth ? classes.maxWidth : ""}`}
                            >
                                <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />
                                <CodeActionButtons
                                    {...{ currentExample, selectedFramework, selectedFile }}
                                    onSandboxOpen={handleSandboxOpen}
                                    className={`${classes.tabbtnwrap} ${isMaxWidth ? "" : classes.hiddenLarge}`}
                                    style={{ minHeight: 35, height: 35, padding: 0, width: "100%" }}
                                />
                                <CodePreview
                                    files={sourceFiles}
                                    selectedFile={selectedFile}
                                    handleFileClick={handleFileClick}
                                    desiredFramework={selectedFramework}
                                    actualFramework={sourceFramework}
                                    examplePath={currentExample.path}
                                    theme={theme}
                                    isMaxWidth={isMaxWidth}
                                />
                            </div>
                        )}
                        <MarkdownContent selectedFramework={selectedFramework} currentExample={currentExample} />
                    </div>
                    <GalleryItems examples={seeAlso} />
                </div>
            </div>
        </div>
    );
};

export default AppDetailsRouter;
