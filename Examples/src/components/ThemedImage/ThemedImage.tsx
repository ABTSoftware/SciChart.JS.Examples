import React, { ImgHTMLAttributes, useEffect, useMemo, useState } from "react";
import { _useContext } from "../../helpers/shared/Helpers/Context";

type TThemedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    src: string;
};

export function ThemedImage({ src, onError, ...rest }: TThemedImageProps) {
    const { getThemedImageCandidates } = _useContext();
    const candidates = useMemo(() => getThemedImageCandidates(src), [getThemedImageCandidates, src]);
    const [candidateIndex, setCandidateIndex] = useState(0);

    useEffect(() => {
        setCandidateIndex(0);
    }, [candidates]);

    const currentSource = candidates[candidateIndex] ?? src;

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
        if (candidateIndex < candidates.length - 1) {
            setCandidateIndex((prev) => prev + 1);
            return;
        }
        onError?.(event);
    };

    return <img {...rest} src={currentSource} onError={handleError} />;
}

