import { useState } from "react";

// Eye (highlight active) — bright yellow background
export const EyeIcon = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="11" fill="#fff8db" /> {/* soft yellow background */}
        <path
            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
            stroke="#f5c400"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <circle cx="12" cy="12" r="3" stroke="#f5c400" strokeWidth="1.6" fill="#fff9e0" />
    </svg>
);

// EyeOff (highlight off) — neutral gray background
export const EyeOffIcon = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="11" fill="#f2f2f2" /> {/* light gray background */}
        <path
            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
            stroke="#777"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <circle cx="12" cy="12" r="3" stroke="#777" strokeWidth="1.5" fill="none" />
    </svg>
);

export default function ShowEyeButton({ onClick, size = 20, className = "", ...rest }) {
    const [highlighted, setHighlighted] = useState(false);

    const computedTitle = highlighted ? "Unhighlight items" : "Highlight items";

    const baseStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
        borderRadius: "4px",
        background: highlighted ? "#fff8db" : "#f9f9f9",
        transition: "background 0.2s ease, transform 0.1s ease",
        padding: "4px",
        cursor: "pointer"
    };

    return (
        <button
            type="button"
            onClick={() => {
                const next = !highlighted;
                setHighlighted(next);
                onClick?.(next);
            }}
            style={baseStyle}
            className={className}
            title={computedTitle}
            aria-label={computedTitle}
            aria-pressed={highlighted}
            {...rest}
        >
            {highlighted ? <EyeIcon size={size} /> : <EyeOffIcon size={size} />}
        </button>
    );
}
