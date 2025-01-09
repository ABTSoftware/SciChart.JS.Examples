import React, { useState, useRef } from "react";
import sdk, { Project, ProjectFiles, VM, ProjectTemplate } from "@stackblitz/sdk";
import styles from "./CodeSandbox.module.scss";
import { SandboxPlatform } from "./SandboxPlatform";
import { EditorFrame } from "./EditorFrame";
import type { StackBlitzResponse } from "../../helpers/types/types";

interface StackblitzEditorProps {
    id?: string;
    onBack?: () => void;
    title?: string;
    exampleName?: string;
    projectFiles?: StackBlitzResponse;
}

export const StackblitzEditor: React.FC<StackblitzEditorProps> = ({ id, onBack, title, exampleName, projectFiles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = document.getElementById("stackblitz-container");
        if (container && projectFiles) {
            // Clear any previous error
            setError(null);
            setIsLoading(true);

            // Merge dependencies and devDependencies
            const allDependencies = {
                ...projectFiles.dependencies,
                ...projectFiles.devDependencies,
            };

            // Create project configuration from the provided files
            const project: Project = {
                files: projectFiles.files,
                title: projectFiles.title,
                description: projectFiles.description,
                template: projectFiles.template,
                dependencies: allDependencies,
            };

            // Embed the Stackblitz editor with more robust configuration
            sdk.embedProject(container, project, {
                height: 500,
                clickToLoad: false,
                openFile: Object.keys(projectFiles.files)[0], // Open first file by default
                terminalHeight: 50,
                hideDevTools: false,
                hideNavigation: false,
                forceEmbedLayout: true,
            })
                .then((vm: VM) => {
                    // Setup connection error handler
                    vm.applyFsDiff({
                        create: {},
                        destroy: [],
                    }).catch((err) => {
                        console.error("StackBlitz VM Error:", err);
                        setError("Failed to connect to StackBlitz VM");
                    });

                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("StackBlitz Embed Error:", err);
                    setError("Failed to load StackBlitz editor");
                    setIsLoading(false);
                });
        }
    }, [projectFiles]);

    return (
        <EditorFrame
            platform={SandboxPlatform.StackBlitz}
            title={title}
            exampleName={exampleName}
            onBack={onBack}
            isLoading={isLoading}
            iframeRef={iframeRef}
        >
            {error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div id="stackblitz-container" className={styles.frame} ref={containerRef} />
            )}
        </EditorFrame>
    );
};
