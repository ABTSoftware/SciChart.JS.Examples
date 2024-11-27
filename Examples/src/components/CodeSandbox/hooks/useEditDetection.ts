import { useState, useCallback, useRef, useEffect } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const initialCodeRef = useRef<string | null>(null);
    const intervalRef = useRef<number>();

    const checkForChanges = useCallback(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: "get-code" }, "*");
        }
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "code") {
                // Store initial code on first response
                if (initialCodeRef.current === null) {
                    initialCodeRef.current = event.data.code;
                } else if (event.data.code !== initialCodeRef.current) {
                    setHasEdits(true);
                }
            }
        };

        window.addEventListener("message", handleMessage);

        // Start periodic checking
        intervalRef.current = window.setInterval(checkForChanges, 5000);

        return () => {
            window.removeEventListener("message", handleMessage);
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
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
