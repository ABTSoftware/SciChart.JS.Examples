import { FC, useState, useRef } from "react";
import styles from "./CodeSandbox.module.scss";
import { SandboxPlatform, getEmbedUrl } from "./SandboxPlatform";
import { EditorFrame } from "./EditorFrame";

type TCodeSandbox = {
    id: string;
    fontSize?: number;
    onBack?: () => void;
    title?: string;
    platform?: SandboxPlatform;
    exampleName?: string;
};

export const CodeSandbox: FC<TCodeSandbox> = ({
    id,
    fontSize = 10,
    onBack,
    title,
    platform = SandboxPlatform.CodeSandbox,
    exampleName,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const url = getEmbedUrl(platform, id, fontSize);

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
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
    );
};
