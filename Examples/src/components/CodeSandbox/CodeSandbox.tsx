import { FC, useState, useRef } from "react";
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
        <div className="sc-editor-frame-container">
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
                    className="sc-editor-frame-embed"
                    {...{ credentialless: "" }}
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    onLoad={handleLoad}
                />
            </EditorFrame>
        </div>
    );
};
