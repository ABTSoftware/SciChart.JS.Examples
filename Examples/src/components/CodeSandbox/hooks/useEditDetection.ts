import { useState, useCallback, useRef, useEffect } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const initialCodeRef = useRef<string | null>(null);

    const checkForChanges = useCallback(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: "get-code" }, "*");
        }
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Store initial code on first response
            if (initialCodeRef.current === null) {
                initialCodeRef.current = event.data;
            } else if (event.data !== initialCodeRef.current) {
                setHasEdits(true);
            }

            // Request next update immediately
            setTimeout(checkForChanges, 1000);
        };

        window.addEventListener("message", handleMessage);

        // Start initial check
        checkForChanges();

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [checkForChanges]);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
        initialCodeRef.current = null;
    }, []);

    return {
        hasEdits,
        iframeRef,
        resetEdits,
    };
};
