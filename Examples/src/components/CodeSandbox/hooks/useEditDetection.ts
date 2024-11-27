import { useState, useCallback, useEffect, useRef } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Check if the active element is our iframe
        if (document.activeElement === iframeRef.current) {
            setHasEdits(true);
        }
    }, []);

    useEffect(() => {
        // Add document-level keydown listener
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
    }, []);

    return {
        hasEdits,
        iframeRef,
        resetEdits,
    };
};
