import { useState, FC, useContext, useMemo, useEffect } from "react";
import classes from "./AppDeatilsRouter.scss";
import { getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import SearchIcon from "../TopBarTabs/images/icon-search.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import { GalleryItem } from "../../helpers/types/types";
import { generateSearchItems, TSearchItem } from "../Search/searchItems";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";
import SubMenuItems from "./SubMenuItems";
import SourceCode from "../SourceCode/SourceCode";
import DetailsCom from "./DetailsComp";
import { FrameworkSelect } from "./FrameworkSelect";
import { EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import CodeIcon from "@mui/icons-material/Code";
import Button from "@mui/material/Button";
import CropFreeIcon from "@mui/icons-material/CropFree";
import { TabName } from "../TopBarTabs";
import TabBar from "../TabBar/TabBar";
import FileExplorer from "../FileExplorer/FileExplorer";
import { Editor } from "@monaco-editor/react";
import { ExampleBreadcrumbs } from "../Breadcrumbs/ExampleBreadcrumbs";

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

const AppDeatilsRouter: FC<TProps> = (props) => {
    const { currentExample, seeAlso } = props;
    const [sourceFiles, setSourceFiles] = useState<{ name: string; content: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<{ name: string; content: string }>({
        name: "",
        content: "",
    });

    const [availableFrameworks, setAvailableFrameworks] = useState<EPageFramework[]>([
        EPageFramework.React,
        EPageFramework.Vanilla,
        EPageFramework.Angular,
    ]);
    const selectedFramework = useContext(FrameworkContext);

    const searchItems: TSearchItem[] = useMemo(
        () => generateSearchItems(ALL_MENU_ITEMS, selectedFramework),
        [selectedFramework]
    );
    const PageTitle = getTitle(currentExample.title, selectedFramework);
    const [query, setQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);

    const handleInputChange = (e: any) => {
        const value = e.target.value.toLowerCase();
        setQuery(e.target.value);

        if (value) {
            const filtered = searchItems.filter(
                (item) => item.category.toLowerCase().includes(value) || item.keywords.toLowerCase().includes(value)
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    };

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

    const isFrameworkVariantAvailable = availableFrameworks?.includes(selectedFramework);

    return (
        <div>
            <div style={{ marginTop: 16 }}>
                <div className={classes.contentwrapper}>
                    <div className={`${classes.tabcontent} ${classes.active}`}>
                        <ExampleBreadcrumbs />

                        {/* Title + Example */}
                        <h1 className={classes.headingtxt}>{PageTitle}</h1>
                        <div className={classes.chartwrap}>
                            <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />
                            <div className={classes.tabbtnwrap}>
                                <a
                                    style={{ marginRight: "auto" }}
                                    href={`/iframe/${currentExample.path}`}
                                    target="_blank"
                                    className={classes.btnprimary}
                                >
                                    <svg
                                        style={{ width: 24, height: 30 }}
                                        stroke="#FFFFFF"
                                        fill="#FFFFFF"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                    >
                                        <path d="M12 3H6.67C4.65 3 3 4.64 3 6.67V12c0 .55.45 1 1 1s1-.45 1-1V6.67C5 5.75 5.75 5 6.67 5H12c.55 0 1-.45 1-1S12.55 3 12 3zM12 27H6.67C5.75 27 5 26.25 5 25.33V20c0-.55-.45-1-1-1s-1 .45-1 1v5.33C3 27.36 4.65 29 6.67 29H12c.55 0 1-.45 1-1S12.55 27 12 27zM28 19c-.55 0-1 .45-1 1v5.33c0 .92-.75 1.67-1.67 1.67H20c-.55 0-1 .45-1 1s.45 1 1 1h5.33c2.02 0 3.67-1.64 3.67-3.67V20C29 19.45 28.55 19 28 19zM25.33 3H20c-.55 0-1 .45-1 1s.45 1 1 1h5.33C26.25 5 27 5.75 27 6.67V12c0 .27.1.52.29.71.04.03.08.05.13.08C27.58 12.91 27.78 13 28 13c.22 0 .42-.09.59-.21.04-.03.09-.04.12-.08.03-.04.05-.08.08-.12C28.91 12.42 29 12.22 29 12V6.67C29 4.64 27.35 3 25.33 3z"></path>
                                    </svg>
                                </a>
                                <a
                                    rel="nofollow external"
                                    className={classes.btn}
                                    style={{ backgroundColor: "#212121" }}
                                    href={`stackblitz/${currentExample.path}?codesandbox=1&framework=${
                                        isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                                    }`}
                                    title={
                                        isFrameworkVariantAvailable
                                            ? `Edit ${getTitle(currentExample.title, selectedFramework)} in StackBlitz`
                                            : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                                    }
                                    target="_blank"
                                >
                                    <svg
                                        style={{ height: 24, width: 24 }}
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
                                    rel="nofollow external"
                                    className={classes.btn}
                                    style={{ backgroundColor: "#212121" }}
                                    href={`codesandbox/${currentExample.path}?codesandbox=1&framework=${
                                        isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                                    }`}
                                    title={
                                        isFrameworkVariantAvailable
                                            ? `Edit ${getTitle(currentExample.title, selectedFramework)} in CodeSandbox`
                                            : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                                    }
                                    target="_blank"
                                >
                                    <svg
                                        style={{ height: 24, width: 24 }}
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
                        </div>

                        <p style={{ padding: "0.75rem 0.25rem" }}>
                            {getTitle(currentExample.description, selectedFramework)}
                        </p>

                        {/* Source code */}
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "relative",
                            }}
                        >
                            {/* <h4>Source code</h4> */}
                            {/* <Select
                                files={[
                                    {name: "React", content: undefined},
                                    {name: "Angular", content: undefined},
                                    {name: "Vue", content: undefined},
                                    {name: "JavaScript", content: undefined},
                                ]}
                                selectedFile={selectedFile}
                                handleFileClick={handleFileClick}
                            /> */}
                        </div>

                        <div className={classes.editortabwrap}>
                            <FileExplorer
                                files={sourceFiles}
                                selectedFile={selectedFile}
                                handleFileClick={handleFileClick}
                            />
                            <Editor
                                height="80vh"
                                theme="light"
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

                        <DetailsCom currentExample={currentExample} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppDeatilsRouter;
