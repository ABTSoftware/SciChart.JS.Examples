import { ReactNode } from "react";
import { createPortal } from "react-dom";

export function BodyPortal({ children }: { children: ReactNode }) {
    return typeof document === "undefined" ? null : createPortal(children, document.body);
}
