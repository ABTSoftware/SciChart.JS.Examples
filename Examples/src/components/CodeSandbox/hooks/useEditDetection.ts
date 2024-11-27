import { useState, useCallback, useRef } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
    }, []);

    return {
        hasEdits,
        iframeRef,
        resetEdits,
    };
};
