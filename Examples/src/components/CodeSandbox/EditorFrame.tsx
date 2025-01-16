import { FC, useState, useRef, useCallback, ReactNode } from "react";
import styles from "./CodeSandbox.module.scss";
import { DisplayMode } from "./DisplayMode";
import { SandboxPlatform } from "./SandboxPlatform";
import { useEditDetection } from "./hooks/useEditDetection";
import { Loader } from "./Loader";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorConfirmDialog } from "./components/EditorConfirmDialog";

interface EditorFrameProps {
    platform: SandboxPlatform;
    title?: string;
    exampleName?: string;
    onBack?: () => void;
    children: ReactNode;
    isLoading?: boolean;
    iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}

export const EditorFrame: FC<EditorFrameProps> = ({
    platform,
    title,
    exampleName,
    onBack,
    children,
    isLoading = false,
    iframeRef,
}) => {
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Embedded);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { hasEdits, resetEdits } = useEditDetection(!isLoading, iframeRef);

    const handleDisplayModeChange = (mode: DisplayMode) => {
        setDisplayMode(mode);
    };

    const containerClassName = `${styles.container} ${
        displayMode === DisplayMode.BrowserFill ? styles.browserFill : ""
    }`;

    const handleBack = useCallback(() => {
        if (hasEdits) {
            setShowConfirmDialog(true);
        } else {
            setShowConfirmDialog(true);
        }
    }, [hasEdits]);

    const handleConfirmClose = useCallback(() => {
        resetEdits();
        setShowConfirmDialog(false);
        onBack?.();
    }, [onBack, resetEdits]);

    const handleCancelClose = useCallback(() => {
        setShowConfirmDialog(false);
    }, []);

    return (
        <div ref={containerRef} className={containerClassName}>
            <EditorToolbar
                platform={platform}
                title={title}
                exampleName={exampleName}
                displayMode={displayMode}
                onDisplayModeChange={handleDisplayModeChange}
                onClose={handleBack}
            />
            <div className={styles.frameContainer}>
                {isLoading && <Loader />}
                {children}
            </div>
            <EditorConfirmDialog
                isOpen={showConfirmDialog}
                hasEdits={hasEdits}
                onConfirm={handleConfirmClose}
                onCancel={handleCancelClose}
            />
        </div>
    );
};
