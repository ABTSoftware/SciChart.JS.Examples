import { useState, useCallback, useRef } from "react";

export const useEditDetection = () => {
    const [hasEdits, setHasEdits] = useState(false);
    const mouseDownCount = useRef(0);

    const handleMouseDown = useCallback(() => {
        mouseDownCount.current += 1;
        // After a short delay, if there was a mousedown, we assume an edit was made
        setTimeout(() => {
            if (mouseDownCount.current > 0) {
                setHasEdits(true);
            }
        }, 100);
    }, []);

    const resetEdits = useCallback(() => {
        setHasEdits(false);
        mouseDownCount.current = 0;
    }, []);

    return {
        hasEdits,
        handleMouseDown,
        resetEdits,
    };
};
