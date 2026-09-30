const CLICKABLE_SELECTOR = [
    "button",
    "a[href]",
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[role="slider"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="tab"]',
    "summary",
    'input:not([type="hidden"])',
    "select",
    "textarea",
].join(",");

function getClickable(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    const clickable = target.closest<HTMLElement>(CLICKABLE_SELECTOR);
    if (!clickable) return null;

    if (clickable instanceof HTMLInputElement && clickable.labels?.length) {
        return clickable.labels[0];
    }

    return clickable;
}

function addRipple(element: HTMLElement, clientX: number, clientY: number) {
    if (element.matches(":disabled, [aria-disabled='true']") || element.closest("[inert]")) return;

    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const size = Math.ceil(Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2);
    const ripple = document.createElement("span");
    const style = getComputedStyle(element);

    ripple.className = "sc-click-ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.left = `${rect.left}px`;
    ripple.style.top = `${rect.top}px`;
    ripple.style.width = `${rect.width}px`;
    ripple.style.height = `${rect.height}px`;
    ripple.style.borderRadius = style.borderRadius;
    ripple.style.color = style.color;
    ripple.style.setProperty("--sc-ripple-x", `${x}px`);
    ripple.style.setProperty("--sc-ripple-y", `${y}px`);
    ripple.style.setProperty("--sc-ripple-size", `${size}px`);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    document.body.append(ripple);
}

export function installPointerRipples() {
    if (typeof document === "undefined" || document.documentElement.hasAttribute("data-sc-ripple-pointer")) return;

    document.documentElement.setAttribute("data-sc-ripple-pointer", "");

    document.addEventListener("pointerdown", (event: PointerEvent) => {
            if (event.button !== 0 || !event.isPrimary) return;
            const element = getClickable(event.target);
            if (element) addRipple(element, event.clientX, event.clientY);
        },
        true
    );

    document.addEventListener("click", (event: MouseEvent) => {
            if (event.detail !== 0) return;
            const element = getClickable(event.target);
            if (!element) return;
            const rect = element.getBoundingClientRect();
            addRipple(element, rect.left + rect.width / 2, rect.top + rect.height / 2);
        },
        true
    );
}
