import { Editor } from "@monaco-editor/react";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import {
    EPageFramework,
    FRAMEWORK_NAME,
    getFrameworkContent,
} from "../../helpers/shared/Helpers/frameworkParametrization";
import { GalleryItem } from "../../helpers/types/types";
import { TExamplePage } from "../AppRouter/examplePages";
import { ALL_MENU_ITEMS, MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
import { ExampleBreadcrumbs } from "../Breadcrumbs/ExampleBreadcrumbs";
import DrawerContent from "../DrawerContent/DrawerContent";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import FileExplorer from "../FileExplorer/FileExplorer";
import GalleryItems from "../GalleryItems";
import { generateSearchItems, TSearchItem } from "../Search/searchItems";
import classes from "./AppDeatilsRouter.scss";
import MarkdownContent from "./MarkdownContent";
import { EPageLayout } from "../../helpers/shared/Helpers/frameworkParametrization";
import { CodeSandbox } from "../CodeSandbox";
import { StackblitzEditor } from "../CodeSandbox/StackblitzEditor";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { CodeActionButtons } from "./CodeActionButtons";
import { Dialog } from "../Dialog/Dialog";

type TProps = {
    currentExample: TExamplePage;
    isIFrame?: boolean;
    seeAlso: GalleryItem[];
};

interface IFiles {
    [key: string]: {
        content: string;
        isBinary: boolean;
    };
}

const EditorLanguageMap = {
    ts: "typescript",
    js: "javascript",
    css: "css",
    html: "html",
    jsx: "javascript",
    tsx: "typescript",
};

const mockFiles = [
    {
        name: "drawExample-for-testing.ts",
        content: `import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EAutoRange } from "scichart/types/AutoRange";

export async function drawExample(divId: string) {  
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { 
        axisAlignment: EAxisAlignment.Bottom 
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { 
        axisAlignment: EAxisAlignment.Left, 
        autoRange: EAutoRange.Always 
    }));

    sciChartSurface.renderableSeries.add(new LineSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            dataSeriesName: "Line Series",
            xValues: [1, 2, 3, 4, 5],
            yValues: [1, 2, 3, 4, 5]
        })
    }))

    sciChartSurface.zoomExtents();
}`,
    },
    {
        name: "index.tsx",
        content: `import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";`,
    },
];

const CodeEditor: FC<{
    files: { name: string; content: string }[];
    selectedFile: { name: string; content: string };
    handleFileClick: (fileName: string) => void;
    desiredFramework: EPageFramework;
    actualFramework: EPageFramework | null;
    examplePath: string;
}> = ({ files, selectedFile, handleFileClick, desiredFramework, actualFramework, examplePath }) => {
    const [hasShownDialog, setHasShownDialog] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const handleMouseEnter = () => {
        if (!hasShownDialog && actualFramework && actualFramework !== desiredFramework) {
            setShowDialog(true);
            setHasShownDialog(true);
        }
    };

    useEffect(() => {
        // Reset dialog state when example changes
        setHasShownDialog(false);
        setShowDialog(false);
    }, [examplePath]);

    return (
        <div className={classes.editortabwrap} onMouseEnter={handleMouseEnter}>
            <FileExplorer files={files} selectedFile={selectedFile} handleFileClick={handleFileClick} />
            <Editor
                theme="light"
                height="100%"
                width="100%"
                language={EditorLanguageMap[selectedFile.name.split(".").pop() as keyof typeof EditorLanguageMap]}
                value={selectedFile.content}
                options={{
                    readOnly: true,
                    lineNumbersMinChars: 3,
                    minimap: { enabled: true },
                    fontSize: 16,
                }}
            />
            <Dialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                text={`This example will be shown in ${FRAMEWORK_NAME[actualFramework]} instead of ${FRAMEWORK_NAME[desiredFramework]}.`}
            />
        </div>
    );
};

const AppDeatilsRouter: FC<TProps> = (props) => {
    const { currentExample, seeAlso } = props;
    const [sourceFiles, setSourceFiles] = useState<{ name: string; content: string }[]>(mockFiles);
    const [selectedFile, setSelectedFile] = useState<{ name: string; content: string }>(mockFiles[0]);

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
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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
        const file = sourceFiles.find((f) => f.name === fileName);
        setSelectedFile({ name: fileName, content: file.content });
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

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <h1
                                className={classes.headingtxt}
                                style={{
                                    margin: "-10px 0",
                                    marginInline: pageLayout === EPageLayout.MaxWidth ? "auto" : 0,
                                    width: pageLayout === EPageLayout.MaxWidth ? "110vh" : "auto",
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
                                    ? { width: "100%", maxWidth: "110vh", margin: "0 auto", textAlign: "start" }
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

export default AppDeatilsRouter;
