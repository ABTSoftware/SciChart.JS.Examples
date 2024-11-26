import { FC } from "react";

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
