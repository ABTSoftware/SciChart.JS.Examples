import { useState, FC, useContext, useEffect } from "react";
import classes from "./AppDeatilsRouter.scss";
import { getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import { TExamplePage } from "../AppRouter/examplePages";
import { GalleryItem } from "../../helpers/types/types";
import { generateSearchItems, TSearchItem } from "../Search/searchItems";
import DetailsCom from "./DetailsComp";
import { EPageFramework } from "../../helpers/shared/Helpers/frameworkParametrization";
import FileExplorer from "../FileExplorer/FileExplorer";
import { ExampleBreadcrumbs } from "../Breadcrumbs/ExampleBreadcrumbs";
import DrawerContent from "../DrawerContent/DrawerContent";
import { ALL_MENU_ITEMS, MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
import GalleryItems from "../GalleryItems";
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

const fakeFiles = [
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
    const [sourceFiles, setSourceFiles] = useState<{ name: string; content: string }[]>(fakeFiles);
    const [selectedFile, setSelectedFile] = useState<{ name: string; content: string }>(fakeFiles[0]);
    const [embedCode, setEmbedCode] = useState<boolean>(false);
    const [sandboxPlatform, setSandboxPlatform] = useState<SandboxPlatform>(SandboxPlatform.CodeSandbox);
    const [sandboxId, setSandboxId] = useState<string>("");

    const selectedFramework = useContext(FrameworkContext);
    const pageTitle = getTitle(currentExample.title, selectedFramework);

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
    };

    const handleSandboxOpen = (platform: SandboxPlatform, id: string) => {
        setSandboxPlatform(platform);
        setSandboxId(id);
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
            return <StackblitzEditor id={sandboxId} onBack={handleBack} exampleName={pageTitle} />;
        }
    };

    return (
        <div>
            <div style={{ display: "flex", padding: 20 }}>
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
                        {getTitle(currentExample.description, selectedFramework)}
                    </p>
                    {embedCode ? renderEditor() : <ExamplesArea />}
                    <GalleryItems examples={seeAlso} />
                </div>
            </div>
        </div>
    );
};

export default AppDeatilsRouter;
