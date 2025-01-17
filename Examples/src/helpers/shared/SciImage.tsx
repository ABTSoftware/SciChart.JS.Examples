import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export function SciImage(
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { alt: string }
) {
    const originalPath = props.src;
    const [basepath, ext] = originalPath.split(".");
    const isReplaceable = ext === "png" || ext === "jpg" || ext === "jpeg";

    return (
        <picture>
            {isReplaceable ? <source type="image/webp" srcSet={`${basepath}.webp`} /> : null}
            <img {...props} />
        </picture>
    );
}
