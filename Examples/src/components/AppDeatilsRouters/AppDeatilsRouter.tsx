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
        name: "drawExample.ts",
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

const AppDeatilsRouter: FC<TProps> = (props) => {
    const { currentExample, seeAlso } = props;
    const [sourceFiles, setSourceFiles] = useState<{ name: string; content: string }[]>(mockFiles);
    const [selectedFile, setSelectedFile] = useState<{ name: string; content: string }>(mockFiles[0]);

    const [pageLayout, setPageLayout] = useState<EPageLayout>(currentExample.pageLayout ?? EPageLayout.Default);
    const [embedCode, setEmbedCode] = useState<boolean>(false);
    const [sandboxPlatform, setSandboxPlatform] = useState<SandboxPlatform>(SandboxPlatform.CodeSandbox);
    const [sandboxId, setSandboxId] = useState<string>("");
    const [projectFiles, setProjectFiles] = useState<any>(null);

    const selectedFramework = useContext(FrameworkContext);
    const pageTitle = getFrameworkContent(currentExample.title, selectedFramework)

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
    const PageTitle = getFrameworkContent(currentExample.title, selectedFramework);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        fetch("/source/" + currentExample.path + "?framework=" + selectedFramework)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((json: { name: string; content: string }[]) => {
                let defaultFile = json.find((f) => f.name === "drawExample.ts");
                if (!defaultFile) {
                    defaultFile = json[json.length - 1];
                }
                setSelectedFile({ name: defaultFile.name, content: defaultFile.content });
                setSourceFiles(json);
            });
    }, [currentExample, selectedFramework]);

    useEffect(() => {
        if (embedCode) {
            setEmbedCode(false);
            setProjectFiles(null);
        }
    }, [currentExample]);

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
    };

    const handleSandboxOpen = (platform: SandboxPlatform, id: string, files?: any) => {
        setSandboxPlatform(platform);
        setSandboxId(id);
        if (files) {
            setProjectFiles(files);
        }
        setEmbedCode(true);
    };

    const ExamplesArea = () => (
        <div className={classes.dynamicFlexWrapper}>
            <div className={classes.chartwrap} style={{ minWidth: "50%" }}>
                <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />
                <CodeActionButtons
                    {...{ currentExample, selectedFramework, selectedFile }}
                    onSandboxOpen={handleSandboxOpen}
                />
            </div>
            <div className={classes.editortabwrap}>
                <FileExplorer files={sourceFiles} selectedFile={selectedFile} handleFileClick={handleFileClick} />
            </div>
        </div>
    );

    const renderEditor = () => {
        if (sandboxPlatform === SandboxPlatform.CodeSandbox) {
            return (
                <CodeSandbox id={sandboxId} onBack={handleBack} platform={sandboxPlatform} exampleName={pageTitle} />
            );
        } else {
            return (
                <StackblitzEditor
                    id={sandboxId}
                    onBack={handleBack}
                    exampleName={pageTitle}
                    projectFiles={projectFiles}
                />
            );
        }
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
                <div className={classes.contentwrapper}>
                    <ExampleBreadcrumbs />
                    <h1 className={classes.headingtxt} style={{ margin: "-10px 0" }}>
                        {pageTitle}
                    </h1>
                    <p className={classes.chartdescription}>
                        {PageTitle}
                    </p>
                    {embedCode ? renderEditor() : <ExamplesArea />}
                    <GalleryItems examples={seeAlso} />
                </div>
            </div>
        </div>
    );
};

export default AppDeatilsRouter;
