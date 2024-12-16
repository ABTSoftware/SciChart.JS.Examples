import { FC, useState, useRef } from "react";
import styles from "./CodeSandbox.module.scss";
import { SandboxPlatform, getEmbedUrl } from "./SandboxPlatform";
import { EditorFrame } from "./EditorFrame";
import { Dialog } from "../Dialog/Dialog";
import { EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";

type TCodeSandbox = {
    id: string;
    fontSize?: number;
    onBack?: () => void;
    title?: string;
    platform?: SandboxPlatform;
    exampleName?: string;
    desiredFramework: EPageFramework;
    actualFramework: EPageFramework;
};

export const CodeSandbox: FC<TCodeSandbox> = ({
    id,
    fontSize = 10,
    onBack,
    title,
    platform = SandboxPlatform.CodeSandbox,
    exampleName,
    desiredFramework,
    actualFramework,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const url = getEmbedUrl(platform, id, fontSize);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const dialogText = `This example will be shown in ${FRAMEWORK_NAME[actualFramework]} instead of ${FRAMEWORK_NAME[desiredFramework]}.`;

    return (
        <div className={styles.container}>
            <EditorFrame
                platform={platform}
                title={title}
                exampleName={exampleName}
                onBack={onBack}
                isLoading={isLoading}
                iframeRef={iframeRef}
            >
                <iframe
                    ref={iframeRef}
                    key={url}
                    src={url}
                    title={platform === SandboxPlatform.CodeSandbox ? "CodeSandbox" : "StackBlitz"}
                    className={styles.frame}
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    onLoad={handleLoad}
                />
            </EditorFrame>
            <Dialog isOpen={desiredFramework !== actualFramework} text={dialogText} />
        </div>
    );
};
