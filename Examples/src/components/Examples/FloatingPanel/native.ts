import "./styles.css";
import { element } from "../demoHelpers";
import { iconButton, CloseIcon } from "../icons/native";

let zIndex = 1000;

/** The same floating panel / mobile drawer used by the framework-independent demos. */
export const floatingPanel = (title: string, position: { x: number; y: number }) => {
    const backdrop = element("div", document.body);
    const node = element("section", backdrop);
    node.setAttribute("aria-label", title);
    const paper = element("div", node, "fp-paper");
    const header = element("div", paper, "fp-handle fp-floating-heading");
    element("strong", header, "", title);
    iconButton(header, `Close ${title}`, CloseIcon, () => setOpen(false));
    const body = element("div", paper, "fp-body");
    const query = window.matchMedia("(max-width: 600px)");
    let open = false;
    const update = () => {
        backdrop.hidden = !open;
        backdrop.style.display = open ? "" : "none";
        backdrop.className = query.matches ? "fp-drawer-backdrop" : "";
        node.className = query.matches ? "fp-drawer" : "fp-floating";
        header.className = query.matches ? "fp-handle fp-drawer-heading" : "fp-handle fp-floating-heading";
        node.role = "dialog";
        node.setAttribute("aria-modal", String(query.matches));
        node.style.transform = query.matches ? "" : `translate(${position.x}px, ${position.y}px)`;
    };
    const setOpen = (value: boolean) => {
        open = value;
        node.style.zIndex = String(++zIndex);
        update();
        if (value) header.querySelector("button")?.focus();
    };
    backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) setOpen(false);
    });
    node.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setOpen(false);
    });
    node.addEventListener("pointerdown", () => {
        node.style.zIndex = String(++zIndex);
    });
    let drag: { x: number; y: number; left: number; top: number } | undefined;
    header.addEventListener("pointerdown", (event) => {
        if (query.matches || (event.target as HTMLElement).closest("button")) return;
        drag = { x: event.clientX, y: event.clientY, left: position.x, top: position.y };
        header.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    header.addEventListener("pointermove", (event) => {
        if (!drag) return;
        position.x = Math.max(0, Math.min(window.innerWidth - node.offsetWidth, drag.left + event.clientX - drag.x));
        position.y = Math.max(0, Math.min(window.innerHeight - header.offsetHeight, drag.top + event.clientY - drag.y));
        update();
    });
    header.addEventListener("pointerup", () => {
        drag = undefined;
    });
    header.addEventListener("pointercancel", () => {
        drag = undefined;
    });
    query.addEventListener("change", update);
    update();
    return {
        body,
        setOpen,
        toggle: () => setOpen(!open),
        dispose: () => {
            query.removeEventListener("change", update);
            backdrop.remove();
        },
    };
};
