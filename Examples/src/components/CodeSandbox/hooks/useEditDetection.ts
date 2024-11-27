import { useState, useCallback } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);

    const handleKeyDown = useCallback(() => {
        setHasEdits(true);
    }, []);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
    }, []);

    return {
        hasEdits,
        handleKeyDown,
        resetEdits,
    };
};
