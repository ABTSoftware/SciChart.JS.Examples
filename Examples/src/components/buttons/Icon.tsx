import { useState, createElement, ReactSVGElement } from "react";

// Mapping between names and SVG components
import * as icons from "./svgIcons";
import { DEFAULT_ICON } from "./svgIcons";
import { useIsomorphicLayoutEffect } from "../../helpers/hooks/useIsomorphicLayoutEffect";

const getSvgText = (name: string) => {
    const icos = icons as Record<string, string>;
    return icos[name] ?? DEFAULT_ICON;
};

// List of valid SVG attributes we want to keep
const validSvgAttributes = ["width", "height", "viewBox", "fill", "stroke", "xmlns", "class", "style"];

export const Icon: React.FC<{ name: string }> = ({ name }) => {
    const [svg, setSvg] = useState<ReactSVGElement>(null);

    useIsomorphicLayoutEffect(() => {
        if (typeof window !== "undefined") {
            const makeSvgNode = (svgText: string) => {
                // Parse the SVG text to create an SVG element
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svgElement = svgDoc.querySelector("svg");
                return svgElement;
            };

            const svgNode = makeSvgNode(getSvgText(name));
            // Filter and transform attributes
            const attrs: { [key: string]: string } = {};
            Array.from(svgNode.attributes).forEach((attr) => {
                if (validSvgAttributes.includes(attr.name)) {
                    attrs[attr.name] = attr.value;
                }
            });

            // Render the SVG element with filtered attributes
            const svgElement = createElement("svg", {
                ...attrs,
                dangerouslySetInnerHTML: { __html: svgNode.innerHTML },
            });

            setSvg(svgElement);
        }
    }, []);

    return svg;
};
