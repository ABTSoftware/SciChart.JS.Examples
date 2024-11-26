import React, { useEffect, useState } from "react";

// Define the root of the images directory as a constant
const ICONS_ROOT = "/assets/icons/";

// List of valid SVG attributes we want to keep
const validSvgAttributes = ["width", "height", "viewBox", "fill", "stroke", "xmlns", "class", "style"];

export const Icon: React.FC<{ name: string }> = ({ name }) => {
    const [svgNode, setSvgNode] = useState<SVGSVGElement | null>(null);

    useEffect(() => {
        let isMounted = true;

        // Construct the full path to the SVG file
        const src = `${ICONS_ROOT}${name}.svg`;

        // Fetch the SVG contents
        fetch(src)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch SVG: ${response.statusText}`);
                }
                return response.text();
            })
            .then((svgText) => {
                if (!isMounted) return;

                // Parse the SVG text to create an SVG element
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svgElement = svgDoc.querySelector("svg");

                if (svgElement) {
                    // Clone the SVG node to React-friendly DOM
                    setSvgNode(svgElement);
                } else {
                    console.error("No <svg> element found in the file.");
                }
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            isMounted = false;
        };
    }, [name]);

    if (!svgNode) {
        return null;
    }

    // Filter and transform attributes
    const attrs: { [key: string]: string } = {};
    Array.from(svgNode.attributes).forEach((attr) => {
        if (validSvgAttributes.includes(attr.name)) {
            attrs[attr.name] = attr.value;
        }
    });

    // Render the SVG element with filtered attributes
    return React.createElement("svg", {
        ...attrs,
        dangerouslySetInnerHTML: { __html: svgNode.innerHTML },
    });
};
