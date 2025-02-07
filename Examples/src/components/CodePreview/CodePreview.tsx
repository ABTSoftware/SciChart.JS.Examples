import { FC, useEffect, useState, type JSX } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import { Dialog } from "../Dialog/Dialog";
import classes from "./index.module.scss";
import { getFileName } from "../AppDetailsRouters/utils";
import { ETheme } from "../../helpers/types/types";
import "react-syntax-highlighter/dist/esm/styles/hljs/dark";
import { IconButton } from "../buttons/IconButton";

const EditorLanguageMap: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    css: "css",
    html: "html",
    jsx: "javascript",
    tsx: "typescript",
    csv: "csv",
    json: "json",
};

const DarkStyles = {
    hljs: {
        display: "block",
        overflowX: "auto",
        padding: "0.25em",
        background: "#121212", // feel free to change to match var(--bg)
        color: "#DCDCDC",
    },
    "hljs-keyword": {
        color: "#569CD6",
    },
    "hljs-literal": {
        color: "#569CD6",
    },
    "hljs-symbol": {
        color: "#569CD6",
    },
    "hljs-name": {
        color: "#569CD6",
    },
    "hljs-link": {
        color: "#569CD6",
        textDecoration: "underline",
    },
    "hljs-built_in": {
        color: "#4EC9B0",
    },
    "hljs-type": {
        color: "#4EC9B0",
    },
    "hljs-number": {
        color: "#B8D7A3",
    },
    "hljs-class": {
        color: "#B8D7A3",
    },
    "hljs-string": {
        color: "#D69D85",
    },
    "hljs-meta-string": {
        color: "#D69D85",
    },
    "hljs-regexp": {
        color: "#9A5334",
    },
    "hljs-template-tag": {
        color: "#9A5334",
    },
    "hljs-subst": {
        color: "#DCDCDC",
    },
    "hljs-function": {
        color: "#DCDCDC",
    },
    "hljs-title": {
        color: "#DCDCDC",
    },
    "hljs-params": {
        color: "#DCDCDC",
    },
    "hljs-formula": {
        color: "#DCDCDC",
    },
    "hljs-comment": {
        color: "#57A64A",
        fontStyle: "italic",
    },
    "hljs-quote": {
        color: "#57A64A",
        fontStyle: "italic",
    },
    "hljs-doctag": {
        color: "#608B4E",
    },
    "hljs-meta": {
        color: "#9B9B9B",
    },
    "hljs-meta-keyword": {
        color: "#9B9B9B",
    },
    "hljs-tag": {
        color: "#9B9B9B",
    },
    "hljs-variable": {
        color: "#BD63C5",
    },
    "hljs-template-variable": {
        color: "#BD63C5",
    },
    "hljs-attr": {
        color: "#9CDCFE",
    },
    "hljs-attribute": {
        color: "#9CDCFE",
    },
    "hljs-builtin-name": {
        color: "#9CDCFE",
    },
    "hljs-section": {
        color: "gold",
    },
    "hljs-emphasis": {
        fontStyle: "italic",
    },
    "hljs-strong": {
        fontWeight: "bold",
    },
    "hljs-bullet": {
        color: "#D7BA7D",
    },
    "hljs-selector-tag": {
        color: "#D7BA7D",
    },
    "hljs-selector-id": {
        color: "#D7BA7D",
    },
    "hljs-selector-class": {
        color: "#D7BA7D",
    },
    "hljs-selector-attr": {
        color: "#D7BA7D",
    },
    "hljs-selector-pseudo": {
        color: "#D7BA7D",
    },
    "hljs-addition": {
        backgroundColor: "#144212",
        display: "inline-block",
        width: "100%",
    },
    "hljs-deletion": {
        backgroundColor: "#600",
        display: "inline-block",
        width: "100%",
    },
};

const LightStyles = {
    hljs: {
        display: "block",
        overflowX: "auto",
        padding: "0.25em",
        background: "white",
        color: "black",
    },
    "hljs-comment": {
        color: "#008000",
    },
    "hljs-quote": {
        color: "#008000",
    },
    "hljs-variable": {
        color: "#008000",
    },
    "hljs-keyword": {
        color: "#00f",
    },
    "hljs-selector-tag": {
        color: "#00f",
    },
    "hljs-built_in": {
        color: "#00f",
    },
    "hljs-name": {
        color: "#00f",
    },
    "hljs-tag": {
        color: "#00f",
    },
    "hljs-string": {
        color: "#a31515",
    },
    "hljs-title": {
        color: "#a31515",
    },
    "hljs-section": {
        color: "#a31515",
    },
    "hljs-attribute": {
        color: "#a31515",
    },
    "hljs-literal": {
        color: "#a31515",
    },
    "hljs-template-tag": {
        color: "#a31515",
    },
    "hljs-template-variable": {
        color: "#a31515",
    },
    "hljs-type": {
        color: "#a31515",
    },
    "hljs-addition": {
        color: "#a31515",
    },
    "hljs-deletion": {
        color: "#2b91af",
    },
    "hljs-selector-attr": {
        color: "#2b91af",
    },
    "hljs-selector-pseudo": {
        color: "#2b91af",
    },
    "hljs-meta": {
        color: "#2b91af",
    },
    "hljs-doctag": {
        color: "#808080",
    },
    "hljs-attr": {
        color: "#f00",
    },
    "hljs-symbol": {
        color: "#00b0e8",
    },
    "hljs-bullet": {
        color: "#00b0e8",
    },
    "hljs-link": {
        color: "#00b0e8",
    },
    "hljs-emphasis": {
        fontStyle: "italic",
    },
    "hljs-strong": {
        fontWeight: "bold",
    },
};

type CodeEditorProps = {
    files: { name: string; content: string }[];
    selectedFile: { name: string; content: string };
    handleFileClick: (fileName: string) => void;
    desiredFramework: EPageFramework;
    actualFramework: EPageFramework | null;
    examplePath: string;
    theme: ETheme;
    isMaxWidth: boolean;
};

const ICONS: Record<string, JSX.Element> = {
    html: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
            <path fill="#E65100" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
            <path fill="#FF6D00" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
            <path
                fill="#FFF"
                d="M24,25v-4h8.6l-0.7,11.5L24,35.1v-4.2l4.1-1.4l0.3-4.5H24z M32.9,17l0.3-4H24v4H32.9z"
            ></path>
            <path
                fill="#EEE"
                d="M24,30.9v4.2l-7.9-2.6L15.7,27h4l0.2,2.5L24,30.9z M19.1,17H24v-4h-9.1l0.7,12H24v-4h-4.6L19.1,17z"
            ></path>
        </svg>
    ),
    css: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
            <path fill="#0277BD" d="M41,5H7l3,34l14,4l14-4L41,5L41,5z"></path>
            <path fill="#039BE5" d="M24 8L24 39.9 35.2 36.7 37.7 8z"></path>
            <path
                fill="#FFF"
                d="M33.1 13L24 13 24 17 28.9 17 28.6 21 24 21 24 25 28.4 25 28.1 29.5 24 30.9 24 35.1 31.9 32.5 32.6 21 32.6 21z"
            ></path>
            <path
                fill="#EEE"
                d="M24,13v4h-8.9l-0.3-4H24z M19.4,21l0.2,4H24v-4H19.4z M19.8,27h-4l0.3,5.5l7.9,2.6v-4.2l-4.1-1.4L19.8,27z"
            ></path>
        </svg>
    ),
    js: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
            <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
            <path
                fill="#000001"
                d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"
            ></path>
        </svg>
    ),
    ts: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48">
            <rect width="36" height="36" x="6" y="6" fill="#1976d2"></rect>
            <polygon
                fill="#fff"
                points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"
            ></polygon>
            <path
                fill="#fff"
                d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986 c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92 c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"
            ></path>
        </svg>
    ),
    jsx: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
                fill="#00bcd4"
                d="M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4-12-2.59-12-4 4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6 14-2.686 14-6-6.268-6-14-6Z"
            />
            <path fill="#00bcd4" d="M16 14a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
            <path
                fill="#00bcd4"
                d="M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493 3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.903.903 0 0 1 .458-.1m-.001-2A2.871 2.871 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124-3.284-5.69-7.72-9.493-10.74-9.493Z"
            />
            <path
                fill="#00bcd4"
                d="M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369Z"
            />
        </svg>
    ),
    tsx: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
                fill="#0288d1"
                d="M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4-12-2.59-12-4 4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6 14-2.686 14-6-6.268-6-14-6Z"
            />
            <path fill="#0288d1" d="M16 14a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
            <path
                fill="#0288d1"
                d="M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493 3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.903.903 0 0 1 .458-.1m-.001-2A2.871 2.871 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124-3.284-5.69-7.72-9.493-10.74-9.493Z"
            />
            <path
                fill="#0288d1"
                d="M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369Z"
            />
        </svg>
    ),
    json: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
                fill="#f9a825"
                d="M560-160v-80h120q17 0 28.5-11.5T720-280v-80q0-38 22-69t58-44v-14q-36-13-58-44t-22-69v-80q0-17-11.5-28.5T680-720H560v-80h120q50 0 85 35t35 85v80q0 17 11.5 28.5T840-560h40v160h-40q-17 0-28.5 11.5T800-360v80q0 50-35 85t-85 35H560Zm-280 0q-50 0-85-35t-35-85v-80q0-17-11.5-28.5T120-400H80v-160h40q17 0 28.5-11.5T160-600v-80q0-50 35-85t85-35h120v80H280q-17 0-28.5 11.5T240-680v80q0 38-22 69t-58 44v14q36 13 58 44t22 69v80q0 17 11.5 28.5T280-240h120v80H280Z"
            />
        </svg>
    ),
    csv: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 17 17" fill="none">
            <path
                d="M13.5 3.5H14V3.29289L13.8536 3.14645L13.5 3.5ZM10.5 0.5L10.8536 0.146447L10.7071 0H10.5V0.5ZM6.5 6.5V6H6V6.5H6.5ZM6.5 8.5H6V9H6.5V8.5ZM8.5 8.5H9V8H8.5V8.5ZM8.5 10.5V11H9V10.5H8.5ZM10.5 9.5H10V9.70711L10.1464 9.85355L10.5 9.5ZM11.5 10.5L11.1464 10.8536L11.5 11.2071L11.8536 10.8536L11.5 10.5ZM12.5 9.5L12.8536 9.85355L13 9.70711V9.5H12.5ZM2.5 6.5V6H2V6.5H2.5ZM2.5 10.5H2V11H2.5V10.5ZM2 5V1.5H1V5H2ZM13 3.5V5H14V3.5H13ZM2.5 1H10.5V0H2.5V1ZM10.1464 0.853553L13.1464 3.85355L13.8536 3.14645L10.8536 0.146447L10.1464 0.853553ZM2 1.5C2 1.22386 2.22386 1 2.5 1V0C1.67157 0 1 0.671573 1 1.5H2ZM1 12V13.5H2V12H1ZM2.5 15H12.5V14H2.5V15ZM14 13.5V12H13V13.5H14ZM12.5 15C13.3284 15 14 14.3284 14 13.5H13C13 13.7761 12.7761 14 12.5 14V15ZM1 13.5C1 14.3284 1.67157 15 2.5 15V14C2.22386 14 2 13.7761 2 13.5H1ZM9 6H6.5V7H9V6ZM6 6.5V8.5H7V6.5H6ZM6.5 9H8.5V8H6.5V9ZM8 8.5V10.5H9V8.5H8ZM8.5 10H6V11H8.5V10ZM10 6V9.5H11V6H10ZM10.1464 9.85355L11.1464 10.8536L11.8536 10.1464L10.8536 9.14645L10.1464 9.85355ZM11.8536 10.8536L12.8536 9.85355L12.1464 9.14645L11.1464 10.1464L11.8536 10.8536ZM13 9.5V6H12V9.5H13ZM5 6H2.5V7H5V6ZM2 6.5V10.5H3V6.5H2ZM2.5 11H5V10H2.5V11Z"
                fill="#000000"
            />
        </svg>
    ),
};

export const CodePreview: FC<CodeEditorProps> = ({
    files,
    selectedFile,
    handleFileClick,
    desiredFramework,
    actualFramework,
    examplePath,
    theme,
    isMaxWidth
}) => {
    const [hasShownDialog, setHasShownDialog] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    enum ECodeSizingMode {
        Minimised,
        Fullscreen
    }

    const [codeSizing, setCodeSizing] = useState(isMaxWidth ? ECodeSizingMode.Minimised : ECodeSizingMode.Fullscreen);
    const isFullscreen = codeSizing == ECodeSizingMode.Fullscreen;

    const handleMouseEnter = () => {
        if (!hasShownDialog && actualFramework && actualFramework !== desiredFramework) {
            setShowDialog(true);
            setHasShownDialog(true);
        }
    };

    function copyCurrentFile() {
        navigator.clipboard.writeText(selectedFile.content);
        setHasCopied(true);
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }

    useEffect(() => {
        // Reset dialog state when example changes
        setHasShownDialog(false);
        setShowDialog(false);
    }, [examplePath]);

    useEffect(() => {
        if (isMaxWidth) {
            setCodeSizing(ECodeSizingMode.Fullscreen);
        }
        else {
            setCodeSizing(ECodeSizingMode.Minimised);
        }
    }, [isMaxWidth]);

    return (
        <div 
            className={`${classes.editorWrapper} ${(isFullscreen && !isMaxWidth) ? classes.fullscreenEditor : ''}`} 
            onMouseEnter={handleMouseEnter}
            style={{
                maxHeight: (!isFullscreen && isMaxWidth) ? 60 : "100%",
            }}
        >
            <div 
                className={classes.horizontalScroller} 
                suppressHydrationWarning={true}
            >
                {/* VSCode-like horizontal scrollable tabs */}
                {files
                    .sort((a, b) => {
                        if (a.name.includes("drawExample")) {
                            return -1;
                        }
                        if (b.name.includes("drawExample")) {
                            return 1;
                        }
                        if (a.name.includes("index")) {
                            return -1;
                        }
                        if (b.name.includes("index")) {
                            return 1;
                        }
                        return a.name.localeCompare(b.name);
                    })
                    .map((file) => (
                        <div
                            key={file.name}
                            className={`${classes.selectTab} ${
                                selectedFile.name === file.name ? classes.activeTab : ""
                            }`}
                            onClick={() => handleFileClick(file.name)}
                        >
                            {ICONS[file.name.split(".").pop() as keyof typeof ICONS]}
                            <p>{getFileName(file.name)}</p>
                        </div>
                    ))}
            </div>

            <div className={classes.rightButtonGroup}>
                {/* Copy to clipboard */}
                <IconButton
                    icon={!hasCopied ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    }
                    selected={hasCopied}
                    onClick={() => copyCurrentFile()}
                    title={hasCopied ? "Copied!" : "Copy to clipboard"}
                    noPadding
                />

                {/* Minimize */}
                <IconButton
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20" fill="none" stroke="currentColor">
                        <path strokeWidth="2" d="M 5 9 h4v-4M 19 15 h-4v4M 15 5 v4h4M 5 15 h4v4"/>
                    </svg>}
                    selected={!isFullscreen}
                    onClick={() => setCodeSizing(ECodeSizingMode.Minimised)}
                    title="Minimise"
                    noPadding
                />

                {/* Fullscreen */}
                <IconButton
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20" fill="currentColor">
                        <path xmlns="http://www.w3.org/2000/svg" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                    </svg>}
                    selected={isFullscreen}
                    onClick={() => setCodeSizing(ECodeSizingMode.Fullscreen)}
                    title="Fullscreen"
                    noPadding
                />
            </div>

            {/* Code */}
            <section 
                className={classes.code}
                style={{ 
                    maxHeight: (!isFullscreen && isMaxWidth) ? 0 : "100%", 
                    maxWidth: '100%',
                }}
            >
                <SyntaxHighlighter
                    language={EditorLanguageMap[selectedFile.name.split(".").pop() as keyof typeof EditorLanguageMap]}
                    // @ts-ignore
                    style={theme === ETheme.dark ? DarkStyles : LightStyles}
                    showLineNumbers={true}
                    lineNumberStyle={{ color: '#888' }}
                    wrapLines
                >
                    {selectedFile.content}
                </SyntaxHighlighter>
            </section>

            <Dialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                text={`This example will be shown in ${FRAMEWORK_NAME[actualFramework]} instead of ${FRAMEWORK_NAME[desiredFramework]}.`}
            />
        </div>
    );
};
