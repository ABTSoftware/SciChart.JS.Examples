import { FC, useState } from "react";
import { Loader } from "./Loader";
import styles from "./CodeSandbox.module.scss";

type TCodeSandbox = {
    id: string;
    fontSize?: number;
};

export const CodeSandbox: FC<TCodeSandbox> = ({ id, fontSize = 10 }) => {
    const [isLoading, setIsLoading] = useState(true);

    const url = `https://codesandbox.io/embed/${id}?fontsize=${fontSize}&view=split`;

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            {isLoading && <Loader />}
            <iframe
                src={url}
                title="CodeSandbox"
                className={styles.frame}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={handleLoad}
            />
        </div>
    );
};
