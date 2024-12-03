import React, { useState, useRef } from "react";
import sdk, { Project } from "@stackblitz/sdk";
import styles from "./CodeSandbox.module.scss";
import { SandboxPlatform } from "./SandboxPlatform";
import { EditorFrame } from "./EditorFrame";

interface StackblitzEditorProps {
    id?: string;
    onBack?: () => void;
    title?: string;
    exampleName?: string;
}

export const StackblitzEditor: React.FC<StackblitzEditorProps> = ({ id, onBack, title, exampleName }) => {
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = document.getElementById("stackblitz-container");
        if (container) {
            // Define a simple TypeScript project
            const project: Project = {
                files: {
                    "index.ts": `console.log('Hello World from TypeScript!');`,
                    "index.html": `
<!DOCTYPE html>
<html>
<head>
    <title>TypeScript Hello World</title>
</head>
<body>
    <h1>TypeScript Hello World</h1>
    <p>Check the console for output</p>
    <script src="index.ts"></script>
</body>
</html>`,
                    "package.json": JSON.stringify(
                        {
                            name: "typescript-hello-world",
                            version: "1.0.0",
                            description: "A simple TypeScript Hello World example",
                            scripts: {
                                start: "ts-node index.ts",
                            },
                            dependencies: {
                                typescript: "^4.9.0",
                                "ts-node": "^10.9.0",
                            },
                        },
                        null,
                        2
                    ),
                },
                title: exampleName || "TypeScript Hello World",
                description: "A simple TypeScript Hello World example",
                template: "node" as const,
                dependencies: {
                    typescript: "^4.9.0",
                    "ts-node": "^10.9.0",
                },
            };

            // Embed the Stackblitz editor
            sdk.embedProject(container, project, {
                height: 500,
                clickToLoad: true,
                openFile: "index.ts",
            }).then(() => {
                setIsLoading(false);
            });
        }
    }, [exampleName]);

    return (
        <EditorFrame
            platform={SandboxPlatform.StackBlitz}
            title={title}
            exampleName={exampleName}
            onBack={onBack}
            isLoading={isLoading}
            iframeRef={iframeRef}
        >
            <div id="stackblitz-container" className={styles.frame} ref={containerRef} />
        </EditorFrame>
    );
};
