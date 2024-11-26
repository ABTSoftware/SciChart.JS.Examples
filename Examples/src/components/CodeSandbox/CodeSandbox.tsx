import { FC, useState } from "react";
import { Loader } from "./Loader";

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
        <div style={{ position: "relative", width: "100%", height: "500px" }}>
            {isLoading && <Loader />}
            <iframe
                src={url}
                title="CodeSandbox"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid black",
                    marginTop: "10px",
                }}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={handleLoad}
            ></iframe>
        </div>
    );
};
