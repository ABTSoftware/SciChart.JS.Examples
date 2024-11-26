import { FC, useState } from "react";

export const Loader: FC = () => (
    <div
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1,
        }}
    >
        <div
            style={{
                width: "50px",
                height: "50px",
                border: "6px solid #ccc",
                borderTop: "6px solid #007BFF",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
            }}
        ></div>
        <style>
            {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
        </style>
    </div>
);

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
