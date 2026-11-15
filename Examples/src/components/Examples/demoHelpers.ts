import { iconButton, CloseIcon } from "./icons/native";

let nextElementId = 0;

/** DOM and disposal helpers shared by the vanilla and Angular examples. */
export const element = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    parent: HTMLElement,
    className = "",
    text = ""
): HTMLElementTagNameMap[K] => {
    const node = document.createElement(tag);
    // SciChart keys its rendering destinations by the host div's DOM id.
    if (tag === "div") node.id = `sc-demo-${++nextElementId}`;
    node.className = className;
    node.textContent = text;
    parent.append(node);
    return node;
};

type HChild = Node | string | number | false | null | undefined;
type HProps = {
    class?: string;
    style?: Partial<CSSStyleDeclaration> | Record<string, string>;
    [name: string]: unknown;
};
const domProperties = new Set([
    "value",
    "checked",
    "disabled",
    "hidden",
    "selected",
    "open",
    "textContent",
    "innerHTML",
    "htmlFor",
    "tabIndex",
]);

/**
 * JSX-shaped element factory: `h("button", { class: "sc-button", type: "button", onclick }, icon, "Label")`.
 * Use it to write the markup in the same order and with the same classes, attributes and inline styles as
 * the React version of an example, so every framework renders the same DOM.
 * - `class` and `style` (camelCase or `--custom` keys) are applied directly;
 * - `on*` functions become event listeners, a few live DOM properties (value, checked, disabled, hidden...)
 *   are assigned, everything else is set as an attribute (`true` -> empty attribute, `false`/null -> omitted);
 * - falsy children are skipped, so `condition && h(...)` works as in JSX.
 */
export const h = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props: HProps = {},
    ...children: HChild[]
): HTMLElementTagNameMap[K] => {
    const node = document.createElement(tag);
    // SciChart keys its rendering destinations by the host div's DOM id.
    if (tag === "div") node.id = `sc-demo-${++nextElementId}`;
    for (const [name, value] of Object.entries(props)) {
        if (value === undefined || value === null) continue;
        if (name === "class") node.className = value as string;
        else if (name === "style") {
            for (const [property, styleValue] of Object.entries(value as Record<string, string>)) {
                if (property.startsWith("--")) node.style.setProperty(property, styleValue);
                else (node.style as unknown as Record<string, string>)[property] = styleValue;
            }
        } else if (typeof value === "function") {
            node.addEventListener(name.replace(/^on/, "").toLowerCase(), value as EventListener);
        } else if (!domProperties.has(name) && value !== false) {
            node.setAttribute(name, value === true ? "" : String(value));
        }
    }
    node.append(
        ...children
            .filter((child): child is Node | string | number => child !== false && child != null)
            .map((child) => (typeof child === "number" ? String(child) : child))
    );
    // Live properties go last: a <select> can only take its value once its options exist.
    for (const [name, value] of Object.entries(props)) {
        if (domProperties.has(name) && value !== undefined && value !== null)
            (node as unknown as Record<string, unknown>)[name] = value;
    }
    return node;
};

export const button = (parent: HTMLElement, label: string, action: () => void) => {
    const node = element("button", parent, "sc-button", label);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
};

export const choices = <T>(
    parent: HTMLElement,
    label: string,
    options: readonly { label: string; value: T }[],
    value: T,
    change: (value: T) => void
) => {
    const group = element("div", parent, "sc-button-group");
    group.role = "group";
    group.setAttribute("aria-label", label);
    const buttons = options.map((option) =>
        button(group, option.label, () => {
            buttons.forEach((node, index) =>
                node.setAttribute("aria-pressed", String(options[index].value === option.value))
            );
            change(option.value);
        })
    );
    buttons.forEach((node, index) => node.setAttribute("aria-pressed", String(options[index].value === value)));
    return buttons;
};

export const select = <T extends string>(
    parent: HTMLElement,
    label: string,
    options: readonly T[],
    value: T,
    change: (value: T) => void
) => {
    const wrapper = element("label", parent, "flex flex-col gap-1", label);
    const node = element("select", wrapper, "sc-select");
    options.forEach((option) => {
        const item = element("option", node, "", option);
        item.value = option;
    });
    node.value = value;
    node.addEventListener("change", () => change(node.value as T));
    return node;
};

export const checkbox = (parent: HTMLElement, label: string, value: boolean, change: (value: boolean) => void) => {
    const wrapper = element("label", parent, "sc-switch");
    const node = element("input", wrapper);
    node.type = "checkbox";
    node.role = "switch";
    node.checked = value;
    wrapper.append(document.createTextNode(label));
    node.addEventListener("change", () => change(node.checked));
    return node;
};

export const input = (
    parent: HTMLElement,
    label: string,
    type: string,
    value: string,
    change: (node: HTMLInputElement) => void
) => {
    const wrapper = element("label", parent, "sc-control", label);
    const node = element("input", wrapper, "sc-input");
    Object.assign(node, { type, value });
    node.addEventListener("input", () => change(node));
    return node;
};

export const dialog = (parent: HTMLElement, title: string) => {
    const node = element("dialog", parent, "sc-modal");
    node.setAttribute("aria-label", title);
    const header = element("header", node, "sc-modal-header");
    element("strong", header, "", title);
    iconButton(header, "Close", CloseIcon, () => node.close());
    node.addEventListener("click", (event) => {
        if (event.target === node) node.close();
    });
    const body = element("div", node, "sc-modal-body");
    return { node, body };
};

export const range = (
    parent: HTMLElement,
    label: string,
    min: number,
    max: number,
    step: number,
    value: number,
    change: (value: number) => void
) => {
    const wrapper = element("label", parent, "flex flex-col gap-1", label);
    const node = element("input", wrapper, "sc-range");
    Object.assign(node, {
        type: "range",
        min: String(min),
        max: String(max),
        step: String(step),
        value: String(value),
    });
    const output = element("output", wrapper, "monospace", String(value));
    node.addEventListener("input", () => {
        output.value = node.value;
        change(node.valueAsNumber);
    });
    return node;
};

export class Demo {
    private disposers: (() => void)[] = [];
    private disposed = false;
    ready: Promise<void>;

    constructor(readonly root: HTMLDivElement, build: (demo: Demo) => Promise<void>) {
        root.replaceChildren();
        root.classList.add("sc-chart-wrapper");
        this.ready = Promise.resolve().then(() => build(this));
        void this.ready.catch((error) => {
            const cancelled = this.disposed;
            this.dispose();
            if (!cancelled && error?.name !== "AbortError") {
                console.error(error);
                element("p", root, "", "Could not load the example.").role = "alert";
            }
        });
    }

    cleanup(dispose: () => void) {
        if (this.disposed) dispose();
        else this.disposers.push(dispose);
    }

    async chart<T extends { sciChartSurface: { delete(): void } }>(
        init: (root: HTMLDivElement) => Promise<T>,
        parent: HTMLElement = this.root,
        className = "w-full h-full",
        onDelete?: (result: T) => void
    ) {
        return this.mount(init, element("div", parent, className), onDelete);
    }

    /** Initialise a chart in a host element that is already in the document, e.g. one created with `h`. */
    async mount<T extends { sciChartSurface: { delete(): void } }>(
        init: (root: HTMLDivElement) => Promise<T>,
        host: HTMLDivElement,
        onDelete?: (result: T) => void
    ) {
        if (this.disposed) throw new DOMException("Example disposed", "AbortError");
        const result = await init(host);
        this.cleanup(() => {
            try {
                onDelete?.(result);
            } finally {
                result.sciChartSurface.delete();
            }
        });
        if (this.disposed) throw new DOMException("Example disposed", "AbortError");
        return result;
    }

    dispose = () => {
        if (this.disposed) return;
        this.disposed = true;
        for (const dispose of this.disposers.reverse()) {
            try {
                dispose();
            } catch (error) {
                console.error(error);
            }
        }
        this.disposers = [];
        this.root.replaceChildren();
    };
}
