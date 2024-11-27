import { useState, useCallback, useEffect, useRef } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const setupEditDetection = useCallback((iframe: HTMLIFrameElement) => {
        iframeRef.current = iframe;

        const handleEvent = () => {
            setHasEdits(true);
        };

        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
            // Listen for various events that might indicate editing
            iframeWindow.addEventListener("keydown", handleEvent);
            iframeWindow.addEventListener("mousedown", handleEvent);
            iframeWindow.addEventListener("input", handleEvent);
            iframeWindow.addEventListener("paste", handleEvent);
            iframeWindow.addEventListener("cut", handleEvent);
        }

        return () => {
            if (iframeWindow) {
                iframeWindow.removeEventListener("keydown", handleEvent);
                iframeWindow.removeEventListener("mousedown", handleEvent);
                iframeWindow.removeEventListener("input", handleEvent);
                iframeWindow.removeEventListener("paste", handleEvent);
                iframeWindow.removeEventListener("cut", handleEvent);
            }
        };
    }, []);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
    }, []);

    useEffect(() => {
        return () => {
            if (iframeRef.current) {
                const iframeWindow = iframeRef.current.contentWindow;
                if (iframeWindow) {
                    // Clean up all event listeners when component unmounts
                    iframeWindow.removeEventListener("keydown", () => {});
                    iframeWindow.removeEventListener("mousedown", () => {});
                    iframeWindow.removeEventListener("input", () => {});
                    iframeWindow.removeEventListener("paste", () => {});
                    iframeWindow.removeEventListener("cut", () => {});
                }
            }
        };
    }, []);

    return {
        hasEdits,
        setupEditDetection,
        resetEdits,
    };
};
