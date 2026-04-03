import React, { ImgHTMLAttributes } from "react";

type TThemedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    src: string;
};

export function ThemedImage({ src, onError, ...rest }: TThemedImageProps) {
    return <img {...rest} src={src} onError={onError} />;
}
