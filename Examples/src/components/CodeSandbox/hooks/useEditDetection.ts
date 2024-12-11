import { useState, useCallback, useRef, useEffect } from "react";

export const useEditDetection = (isLoaded: boolean, iframeRef: React.RefObject<HTMLIFrameElement>) => {
    const [hasEdits, setHasEdits] = useState(false);
    const initialCodeRef = useRef<string | null>(null);

    const checkForChanges = useCallback(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: "get-code" }, "*");
        }
    }, [iframeRef]);

    useEffect(() => {
        if (!isLoaded) return undefined;

        const handleMessage = (event: MessageEvent) => {
            const code = event.data;
            const initial = initialCodeRef.current;

            // Store initial code on first response
            if (initial === null) {
                initialCodeRef.current = code;
                return;
            }

            // Only check for changes if both values are defined
            if (code && initial) {
                if (code.length !== initial.length || !initial.startsWith(code)) {
                    setHasEdits(true);
                }
            }

            // Request next update immediately
            setTimeout(checkForChanges, 1000);
        };

        window.addEventListener("message", handleMessage);

        // Start initial check only after iframe is loaded
        checkForChanges();

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [checkForChanges, isLoaded]);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
        initialCodeRef.current = null;
    }, []);

    return {
        hasEdits,
        resetEdits,
    };
};
