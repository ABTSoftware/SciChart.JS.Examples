const svg = (content: string, className = "") => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    node.setAttribute("aria-hidden", "true");
    node.setAttribute("focusable", "false");
    node.setAttribute("width", "1.5rem");
    node.setAttribute("height", "1.5rem");
    node.setAttribute("viewBox", "0 0 24 24");
    node.setAttribute("fill", "currentColor");
    if (className) node.setAttribute("class", className);
    node.innerHTML = content;
    return node;
};

const applyButtonIcon = (button: HTMLButtonElement, icon: () => SVGSVGElement, label: string) => {
    button.replaceChildren(icon());
    button.classList.add("sc-button-icon");
    button.setAttribute("aria-label", label);
    button.title = label;
};

export const setButtonIcon = applyButtonIcon;

export const iconButton = (parent: HTMLElement, label: string, icon: () => SVGSVGElement, action: () => void) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "sc-button";
    applyButtonIcon(node, icon, label);
    node.addEventListener("click", action);
    parent.append(node);
    return node;
};

export const PlayArrowIcon = (className = "") => svg('<path d="M7 5v14l11-7z" />', className);
export const StopIcon = (className = "") => svg('<path d="M6 5h4v14H6zm8 0h4v14h-4z" />', className);
export const RefreshIcon = (className = "") =>
    svg(
        '<path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.93 9h-2.02A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z" />',
        className
    );
export const CopyIcon = (className = "") =>
    svg(
        '<path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm4 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h12z" />',
        className
    );
export const SettingsIcon = (className = "") =>
    svg(
        '<path d="M19.14 12.94c.04-.31.06-.62.06-.94s-.02-.63-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.95l-.36-2.54a.49.49 0 0 0-.49-.42h-3.84a.49.49 0 0 0-.49.42l-.36 2.54c-.59.23-1.13.55-1.63.95l-2.39-.96a.49.49 0 0 0-.61.22L2.64 8.84a.49.49 0 0 0 .12.64l2.03 1.58c-.05.31-.08.63-.08.94s.03.63.08.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.21.37.3.61.22l2.39-.96c.5.39 1.04.71 1.63.95l.36 2.54c.04.24.25.42.49.42h3.84c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.63-.95l2.39.96c.23.09.49-.01.61-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7" />',
        className
    );
export const DeleteSweepIcon = (className = "") =>
    svg(
        '<path d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM6 7v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7zM9 10h2v7H9zm4 0h2v7h-2z" />',
        className
    );
export const GestureIcon = (className = "") =>
    svg(
        '<path d="M2 12a2 2 0 0 1 4 0v2h1V6a2 2 0 0 1 4 0v6h1V4a2 2 0 0 1 4 0v8h1V7a2 2 0 0 1 4 0v8a7 7 0 0 1-7 7h-2a7 7 0 0 1-6.3-4L2.4 14.2A2 2 0 0 1 2 12" />',
        className
    );
export const LinkIcon = (className = "") =>
    svg(
        '<path d="M10 8H7a4 4 0 0 0 0 8h3m4-8h3a4 4 0 0 1 0 8h-3M8 12h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />',
        className
    );
export const LinkOffIcon = (className = "") =>
    svg(
        '<path d="M7 8a4 4 0 0 0 0 8h3m4-8h3a4 4 0 0 1 0 8M8 12h2m4 0h2M3 3l18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />',
        className
    );
export const SaveAltIcon = (className = "") => svg('<path d="M5 20h14v-2H5zm7-3 5-5h-3V4h-4v8H7z" />', className);
export const CloseIcon = (className = "") =>
    svg(
        '<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />',
        className
    );
export const InfoIcon = (className = "") =>
    svg(
        '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5" /> <path d="M11.25 10h1.5v7h-1.5zm0-4h1.5v2h-1.5z" />',
        className
    );
export const ExpandMoreIcon = (className = "") => svg('<path d="m7 10 5 5 5-5z" />', className);
export const GitHubIcon = (className = "") =>
    svg(
        '<path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.31-3.76-1.31-.51-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.12.08 1.72 1.15 1.72 1.15 1 .1.77 2.53 3.45 1.87.1-.73.39-1.23.7-1.52-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.43-2.22 1.15-3-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8" />',
        className
    );
export const SubdirectoryArrowRight = (className = "") =>
    svg('<path d="M19 15v-3a4 4 0 0 0-4-4H5v2h10a2 2 0 0 1 2 2v3h-3l4 4 4-4z" />', className);
