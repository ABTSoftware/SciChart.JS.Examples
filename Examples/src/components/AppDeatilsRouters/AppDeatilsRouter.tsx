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

    const [availableFrameworks, setAvailableFrameworks] = useState<EPageFramework[]>([
        EPageFramework.React,
        EPageFramework.Vanilla,
        EPageFramework.Angular,
    ]);
    const selectedFramework = useContext(FrameworkContext);

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

    const handleFileClick = (fileName: string) => {
        const file = sourceFiles.find((f) => f.name === fileName);
        setSelectedFile({ name: fileName, content: file.content });
    };

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const isFrameworkVariantAvailable = availableFrameworks?.includes(selectedFramework);
    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];
    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);

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
                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <div className={classes.contentwrapper}>
                        <div style={{ display: "flex" }}>
                            <ExampleBreadcrumbs />

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
                        </div>

                        <div style={{ display: "flex"}}>
                            {/* Title */}
                            <h1 className={classes.headingtxt}>{PageTitle}</h1>

                            {/* Git, CodeSandbox, Stackblitz buttons */}
                            {!(pageLayout === EPageLayout.MaxWidth) ?
                            <div className={`${classes.tabbtnwrap} ${classes.hiddenSmall}`}>
                                <a
                                    rel="nofollow external"
                                    className={classes.btn}
                                    style={{ backgroundColor: "#212121" }}
                                    href={`stackblitz/${currentExample.path}?codesandbox=1&framework=${
                                        isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                                    }`}
                                    title={
                                        isFrameworkVariantAvailable
                                            ? `Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in StackBlitz`
                                            : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                                    }
                                    target="_blank"
                                >
                                    <svg 
                                        role="img" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        style={{ height: 20, width: 20 }}
                                    >
                                        <path fill="#ffffff" d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"/>
                                    </svg>
                                    &nbsp;Edit
                                </a>
                                <a
                                    rel="nofollow external"
                                    className={classes.btn}
                                    style={{ backgroundColor: "#212121" }}
                                    href={`codesandbox/${currentExample.path}?codesandbox=1&framework=${
                                        isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                                    }`}
                                    title={
                                        isFrameworkVariantAvailable
                                            ? `Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in CodeSandbox`
                                            : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                                    }
                                    target="_blank"
                                >
                                    <svg
                                        style={{ height: 20, width: 20 }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        id="code-sandbox"
                                    >
                                        <path
                                            fill="#ffffff"
                                            d="M22.5 17.95 22.41 6 11.955 0 1.5 6v12l10.455 6L22.5 17.95zm-2.173-4.711L16.982 15.1v3.514L13.01 20.91v-8.272l7.317-4.157v4.758zm-9.422 7.671-3.972-2.296v-3.516l-3.345-1.86V8.481l7.317 4.157v8.272zM4.634 6.601 4.633 6.6l3.913-2.255 3.43 1.968 3.41-1.945 3.871 2.197-7.32 4.18-7.303-4.144z"
                                        ></path>
                                    </svg>
                                    &nbsp;Edit
                                </a>
                                <a
                                    target="_blank"
                                    href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile}`}
                                    style={{ backgroundColor: "rgb(42, 99, 151)" }}
                                    className={classes.btn}
                                >
                                    <svg
                                        style={{ height: 30, width: 30 }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        viewBox="3 0 24 30"
                                    >
                                        <path
                                            fill="#fff"
                                            d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
                                        ></path>
                                    </svg>
                                    &nbsp;View&nbsp;Source
                                </a>
                            </div>
                            : null }
                        </div>

                        <div 
                            className={classes.dynamicFlexWrapper} 
                            style={pageLayout === EPageLayout.MaxWidth ? {flexDirection: "column"} : {}}
                        >
                            <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />

                            {/* Git, CodeSandbox, Stackblitz buttons */}
                            <div 
                                className={`${classes.tabbtnwrap} ${pageLayout === EPageLayout.MaxWidth ? "" : classes.hiddenLarge}`}
                                style={{minHeight: 35, height: 35, padding: 0, width: '100%'}}
                            >
                                <a
                                    rel="nofollow external"
                                    className={classes.btn}
                                    style={{ backgroundColor: "#212121" }}
                                    href={`stackblitz/${currentExample.path}?codesandbox=1&framework=${
                                        isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                                    }`}
                                    title={
                                        isFrameworkVariantAvailable
                                            ? `Edit ${getFrameworkContent(
                                                  currentExample.title,
                                                  selectedFramework
                                              )} in StackBlitz`
                                            : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                                    }
                                    target="_blank"
                                >
                                    <svg 
                                        role="img" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        style={{ height: 20, width: 20 }}
                                    >
                                        <path fill="#ffffff" d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"/>
                                    </svg>
                                </a>
                                <a
                                    rel="nofollow external"
                                    className={classes.btn}
                                    style={{ backgroundColor: "#212121" }}
                                    href={`codesandbox/${currentExample.path}?codesandbox=1&framework=${
                                        isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                                    }`}
                                    title={
                                        isFrameworkVariantAvailable
                                            ? `Edit ${getFrameworkContent(
                                                  currentExample.title,
                                                  selectedFramework
                                              )} in CodeSandbox`
                                            : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                                    }
                                    target="_blank"
                                >
                                    <svg
                                        style={{ height: 20, width: 20 }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        id="code-sandbox"
                                    >
                                        <path
                                            fill="#ffffff"
                                            d="M22.5 17.95 22.41 6 11.955 0 1.5 6v12l10.455 6L22.5 17.95zm-2.173-4.711L16.982 15.1v3.514L13.01 20.91v-8.272l7.317-4.157v4.758zm-9.422 7.671-3.972-2.296v-3.516l-3.345-1.86V8.481l7.317 4.157v8.272zM4.634 6.601 4.633 6.6l3.913-2.255 3.43 1.968 3.41-1.945 3.871 2.197-7.32 4.18-7.303-4.144z"
                                        ></path>
                                    </svg>
                                </a>
                                <a
                                    target="_blank"
                                    href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile}`}
                                    style={{ backgroundColor: "rgb(42, 99, 151)" }}
                                    className={classes.btn}
                                >
                                    <svg
                                        style={{ height: 30, width: 30 }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        viewBox="3 0 24 30"
                                    >
                                        <path
                                            fill="#fff"
                                            d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
                                        ></path>
                                    </svg>
                                </a>
                            </div>
                            
                            {/* Source code */}
                            <div className={classes.editortabwrap}>
                                <FileExplorer
                                    files={sourceFiles}
                                    selectedFile={selectedFile}
                                    handleFileClick={handleFileClick}
                                />
                                
                                <Editor
                                    theme="light"
                                    height="100%"
                                    width="100%"
                                    language={
                                        EditorLanguageMap[
                                            selectedFile.name.split(".").pop() as keyof typeof EditorLanguageMap
                                        ]
                                    }
                                    value={selectedFile.content}
                                    options={{
                                        readOnly: true, // to edit this example, press the "edit" button
                                        lineNumbersMinChars: 3,
                                        minimap: {
                                            enabled: true,
                                        },
                                        fontSize: 16,
                                    }}
                                />
                            </div>
                        </div>

                       {/* Subtitle */}
                        <p className={classes.chartdescription}>
                            {currentExample.subtitle(selectedFramework)}
                        </p>

                        <MarkdownContent selectedFramework={selectedFramework} currentExample={currentExample} />
                    </div>
                    <GalleryItems 
                        examples={seeAlso} 
                    />
                </div>
            </div>
        </div>
    );
};

export default AppDeatilsRouter;
