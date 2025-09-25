interface ElementData {
    [key: string]: any;
}

interface SelectionNode extends Element {
    __data__?: ElementData;
}

class Selection {
    private elements: SelectionNode[];

    constructor(elements: SelectionNode[] = []) {
        this.elements = elements;
    }

    // Core selection methods
    static select(selector: string | Element): Selection {
        let element: Element | null;

        if (typeof selector === "string") {
            element = document.querySelector(selector);
        } else {
            element = selector;
        }

        return new Selection(element ? [element as SelectionNode] : []);
    }

    static selectAll(selector: string | NodeList | Element[]): Selection {
        let elements: Element[];

        if (typeof selector === "string") {
            elements = Array.from(document.querySelectorAll(selector));
        } else if (selector instanceof NodeList) {
            elements = Array.from(selector).filter((node): node is Element => node instanceof Element);
        } else {
            elements = Array.from(selector);
        }

        return new Selection(elements as SelectionNode[]);
    }

    // Sub-selection methods
    select(selector: string | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => Element | null)): Selection {
        const selected: SelectionNode[] = [];

        this.elements.forEach((element, i) => {
            let child: Element | null = null;

            if (typeof selector === "string") {
                child = element.querySelector(selector);
            } else if (typeof selector === "function") {
                child = selector.call(element, element.__data__, i, this.elements);
            }

            if (child) {
                selected.push(child as SelectionNode);
            }
        });

        return new Selection(selected);
    }

    selectAll(
        selector: string | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => NodeList | Element[])
    ): Selection {
        const selected: SelectionNode[] = [];

        this.elements.forEach((element, i) => {
            let children: Element[] = [];

            if (typeof selector === "string") {
                children = Array.from(element.querySelectorAll(selector));
            } else if (typeof selector === "function") {
                const result = selector.call(element, element.__data__, i, this.elements);
                children = (result instanceof NodeList ? Array.from(result) : Array.from(result)).filter((node): node is Element => node instanceof Element);
            }

            selected.push(...(children as SelectionNode[]));
        });

        return new Selection(selected);
    }

    // Filtering and manipulation
    filter(selector: string | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => boolean)): Selection {
        const filtered: SelectionNode[] = [];

        this.elements.forEach((element, i) => {
            let shouldInclude = false;

            if (typeof selector === "string") {
                shouldInclude = element.matches(selector);
            } else if (typeof selector === "function") {
                shouldInclude = selector.call(element, element.__data__, i, this.elements);
            }

            if (shouldInclude) {
                filtered.push(element);
            }
        });

        return new Selection(filtered);
    }

    // Attribute manipulation
    attr(name: string): string | null;
    attr(
        name: string,
        value:
            | string
            | number
            | null
            | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string | number | null)
    ): Selection;
    attr(
        name: string,
        value?:
            | string
            | number
            | null
            | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string | number | null)
    ): Selection | string | null {
        if (arguments.length === 1) {
            // Getter
            return this.elements.length > 0 ? this.elements[0].getAttribute(name) : null;
        }

        // Setter
        this.elements.forEach((element, i) => {
            let finalValue: string | number | null;

            if (typeof value === "function") {
                finalValue = value.call(element, element.__data__, i, this.elements);
            } else {
                finalValue = value;
            }

            if (finalValue === null) {
                element.removeAttribute(name);
            } else {
                element.setAttribute(name, String(finalValue));
            }
        });

        return this;
    }

    // Style manipulation
    style(name: string): string;
    style(
        name: string,
        value:
            | string
            | number
            | null
            | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string | number | null)
    ): Selection;
    style(
        name: string,
        value?:
            | string
            | number
            | null
            | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string | number | null)
    ): Selection | string {
        if (arguments.length === 1) {
            // Getter
            if (this.elements.length > 0) {
                return getComputedStyle(this.elements[0]).getPropertyValue(name);
            }
            return "";
        }

        // Setter
        this.elements.forEach((element, i) => {
            let finalValue: string | number | null;

            if (typeof value === "function") {
                finalValue = value.call(element, element.__data__, i, this.elements);
            } else {
                finalValue = value;
            }

            if (finalValue === null) {
                (element as HTMLElement).style.removeProperty(name);
            } else {
                (element as HTMLElement).style.setProperty(name, String(finalValue));
            }
        });

        return this;
    }

    // Text content
    text(): string;
    text(
        value: string | number | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string | number)
    ): Selection;
    text(
        value?: string | number | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string | number)
    ): Selection | string {
        if (arguments.length === 0) {
            // Getter
            return this.elements.length > 0 ? this.elements[0].textContent || "" : "";
        }

        // Setter
        this.elements.forEach((element, i) => {
            let finalValue: string | number;

            if (typeof value === "function") {
                finalValue = value.call(element, element.__data__, i, this.elements);
            } else {
                finalValue = value!;
            }

            element.textContent = String(finalValue);
        });

        return this;
    }

    // HTML content
    html(): string;
    html(value: string | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string)): Selection;
    html(value?: string | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => string)): Selection | string {
        if (arguments.length === 0) {
            // Getter
            return this.elements.length > 0 ? this.elements[0].innerHTML : "";
        }

        // Setter
        this.elements.forEach((element, i) => {
            let finalValue: string;

            if (typeof value === "function") {
                finalValue = value.call(element, element.__data__, i, this.elements);
            } else {
                finalValue = value!;
            }

            element.innerHTML = finalValue;
        });

        return this;
    }

    // Data binding
    data(): ElementData[];
    data(values: ElementData[] | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => ElementData[])): Selection;
    data(
        values?: ElementData[] | ((d?: ElementData, i?: number, nodes?: SelectionNode[]) => ElementData[])
    ): Selection | ElementData[] {
        if (arguments.length === 0) {
            // Getter
            return this.elements.map((element) => element.__data__ || {});
        }

        // Setter
        let dataArray: ElementData[];

        if (typeof values === "function") {
            dataArray = values.call(null, undefined, 0, this.elements);
        } else {
            dataArray = values!;
        }

        this.elements.forEach((element, i) => {
            if (i < dataArray.length) {
                element.__data__ = dataArray[i];
            }
        });

        return this;
    }

    // Event handling
    on(type: string, listener: ((this: SelectionNode, event: Event, d?: ElementData) => void) | null): Selection {
        this.elements.forEach((element) => {
            if (listener === null) {
                // Remove event listener
                const existingListener = (element as any)[`__${type}_listener`];
                if (existingListener) {
                    element.removeEventListener(type, existingListener);
                    delete (element as any)[`__${type}_listener`];
                }
            } else {
                // Add event listener
                const wrappedListener = (event: Event) => {
                    listener.call(element, event, element.__data__);
                };

                element.addEventListener(type, wrappedListener);
                (element as any)[`__${type}_listener`] = wrappedListener;
            }
        });

        return this;
    }

    // Iteration
    each(callback: (this: SelectionNode, d?: ElementData, i?: number, nodes?: SelectionNode[]) => void): Selection {
        this.elements.forEach((element, i) => {
            callback.call(element, element.__data__, i, this.elements);
        });

        return this;
    }

    // Utility methods
    empty(): boolean {
        return this.elements.length === 0;
    }

    node(): SelectionNode | null {
        return this.elements.length > 0 ? this.elements[0] : null;
    }

    nodes(): SelectionNode[] {
        return [...this.elements];
    }

    size(): number {
        return this.elements.length;
    }
}

// Export the main selection functions
export function select(selector: string | Element): Selection {
    return Selection.select(selector);
}

export function selectAll(selector: string | NodeList | Element[]): Selection {
    return Selection.selectAll(selector);
}

export { Selection };
