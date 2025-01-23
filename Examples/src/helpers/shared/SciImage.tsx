import { DetailedHTMLProps, ImgHTMLAttributes, useContext } from "react";
import { FrameworkContext } from "./Helpers/FrameworkContext";

export function SciImage(
    props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { alt: string }
) {
    const framework = useContext(FrameworkContext);
    const originalPath = props.src;
    // if (!originalPath.split("/").pop().startsWith("javascript")) {
    //     console.warn(`Inconsistent image naming: "${originalPath}"!`)
    // }

    const frameworkSpecificUrl = originalPath.replace("javascript", framework);
    const [basepath, ext] = frameworkSpecificUrl.split(".");
    const isReplaceable = ext === "png" || ext === "jpg" || ext === "jpeg";

    const updatedProps = { ...props, src: frameworkSpecificUrl };

    return (
        <picture>
            {isReplaceable ? <source type="image/webp" srcSet={`${basepath}.webp`} /> : null}
            <img {...updatedProps} />
        </picture>
    );
}
