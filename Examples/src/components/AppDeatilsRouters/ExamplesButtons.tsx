import React, { FC, ReactNode, useState } from "react";
import classes from "./AppDeatilsRouter.scss";
import { EPageFramework, FRAMEWORK_NAME, getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TExamplePage } from "../AppRouter/examplePages";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { getSandboxUrl } from "./sandboxUtils";

const getFrameWorkName = (frameWork: string): string => {
    return (FRAMEWORK_NAME as any)[frameWork];
};

type TExampleButtonsProps = {
    currentExample: TExamplePage;
    selectedFramework: EPageFramework;
    selectedFile: { name: string; content: string };
    onSandboxOpen: (platform: SandboxPlatform, sandboxId: string) => void;
};

export const ExamplesButtons: FC<TExampleButtonsProps> = ({
    currentExample,
    selectedFramework,
    onSandboxOpen,
    selectedFile,
}): ReactNode => {
    const [availableFrameworks] = useState<EPageFramework[]>([
        EPageFramework.React,
        EPageFramework.Vanilla,
        EPageFramework.Angular,
    ]);

    const isFrameworkVariantAvailable = availableFrameworks?.includes(selectedFramework);
    const frameWorkName = getFrameWorkName(selectedFramework);

    const handleSandboxClick = async (e: React.MouseEvent<HTMLAnchorElement>, platform: SandboxPlatform) => {
        e.preventDefault();
        try {
            const framework = isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React;
            const frameworkType = framework.toLowerCase() as "react" | "angular" | "vanilla";

            if (platform === SandboxPlatform.CodeSandbox) {
                const sandboxId = await getSandboxUrl(currentExample.path, frameworkType, platform);
                if (sandboxId) {
                    onSandboxOpen(platform, sandboxId);
                } else {
                    console.log("error");
                }
            } else {
                // For StackBlitz, directly open the editor without getting a URL
                onSandboxOpen(platform, currentExample.path);
            }
        } catch (error) {
            console.error("Failed to open sandbox:", error);
        }
    };

    return (
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
                &nbsp;Full Screen
            </a>
            <a
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.StackBlitz)}
                rel="nofollow external"
                className={classes.btn}
                style={{ backgroundColor: "#212121" }}
                title={
                    isFrameworkVariantAvailable
                        ? `Edit ${getTitle(currentExample.title, selectedFramework)} in StackBlitz`
                        : `Sorry, we have not got ${frameWorkName} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                }
            >
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: 24, width: 24 }}
                >
                    <path fill="#ffffff" d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z" />
                </svg>
                &nbsp;Edit
            </a>
            <a
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.CodeSandbox)}
                rel="nofollow external"
                className={classes.btn}
                style={{ backgroundColor: "#212121" }}
                title={
                    isFrameworkVariantAvailable
                        ? `Edit ${getTitle(currentExample.title, selectedFramework)} in CodeSandbox`
                        : `Sorry, we have not got ${frameWorkName} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                }
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
                &nbsp;Edit
            </a>
            <a
                target="_blank"
                href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile.name}`}
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
                &nbsp;View Source
            </a>
        </div>
    );
};
