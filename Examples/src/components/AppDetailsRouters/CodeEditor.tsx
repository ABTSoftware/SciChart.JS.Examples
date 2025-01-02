import { Editor } from "@monaco-editor/react";
import { FC, useEffect, useState } from "react";
import { EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import FileExplorer from "../FileExplorer/FileExplorer";
import { Dialog } from "../Dialog/Dialog";
import classes from "./AppDetailsRouter.scss";
import { getFileName, processFiles } from "./utils";

const EditorLanguageMap = {
    ts: "typescript",
    js: "javascript",
    css: "css",
    html: "html",
    jsx: "javascript",
    tsx: "typescript",
};

type CodeEditorProps = {
    files: { name: string; content: string }[];
    selectedFile: { name: string; content: string };
    handleFileClick: (fileName: string) => void;
    desiredFramework: EPageFramework;
    actualFramework: EPageFramework | null;
    examplePath: string;
};

export const CodeEditor: FC<CodeEditorProps> = ({
    files,
    selectedFile,
    handleFileClick,
    desiredFramework,
    actualFramework,
    examplePath,
}) => {
    const [hasShownDialog, setHasShownDialog] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    // Process files to ensure only filenames are shown and properly sorted
    const processedFiles = processFiles(files);
    const processedSelectedFile = {
        ...selectedFile,
        name: getFileName(selectedFile?.name),
    };

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
            <FileExplorer
                files={processedFiles}
                selectedFile={processedSelectedFile}
                handleFileClick={handleFileClick}
            />
            <Editor
                theme="light"
                height="100%"
                width="100%"
                loading={selectedFile.content}
                language={
                    EditorLanguageMap[processedSelectedFile.name.split(".").pop() as keyof typeof EditorLanguageMap]
                }
                value={processedSelectedFile.content}
                options={{
                    readOnly: true,
                    lineNumbersMinChars: 2,
                    minimap: { enabled: true },
                    fontSize: 14,
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
