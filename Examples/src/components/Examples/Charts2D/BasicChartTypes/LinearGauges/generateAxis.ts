/**
 * Generates an SVG string with a custom axis
 *
 * @param {string} axisType - 'bottom', 'top', 'left', or 'right'
 * @param {Object} scale - Scale configuration object
 * @param {Array} scale.domain - [min, max] values for the scale
 * @param {Array} scale.range - [start, end] pixel positions
 * @param {string} scale.type - 'linear', 'band', or 'ordinal'
 * @param {number} length - Length of the axis in pixels
 * @param {Object} options - Additional configuration options
 * @param {number} [options.tickSize=6] - Size of the axis ticks
 * @param {number} [options.tickPadding=3] - Padding between ticks and labels
 * @param {number} [options.tickCount=5] - Number of ticks to generate
 * @param {Function} [options.tickFormat] - Function to format tick labels
 * @returns {string} SVG markup with custom axis
 */
interface AxisOptions {
    tickSize?: number;
    tickPadding?: number;
    tickCount?: number;
    tickFormat?: (d: any) => string;
    color?: string
}

export default function generateAxisSVG(axisType: string, scale: any, length: number, options: AxisOptions = {}) {
    const { tickSize = 6, tickPadding = 3, tickCount = 5, tickFormat = (d) => d.toString(), color = "white" } = options;

    // Generate tick values based on scale type
    function generateTicks(scale: { domain: [any, any]; type: string }, count: number) {
        const [min, max] = scale.domain;
        const ticks = [];

        if (scale.type === "linear") {
            const step = (max - min) / (count - 1);
            for (let i = 0; i < count; i++) {
                ticks.push(min + step * i);
            }
        } else if (scale.type === "band" || scale.type === "ordinal") {
            // For band/ordinal scales, domain should be an array of categories
            return scale.domain;
        }

        return ticks;
    }

    // Convert domain value to pixel position
    function scaleValue(value: number, scale: { domain: string | any[]; range: [any, any]; type: string }) {
        const [domainMin, domainMax] = scale.domain;
        const [rangeMin, rangeMax] = scale.range;

        if (scale.type === "linear") {
            const ratio = (value - domainMin) / (domainMax - domainMin);
            return rangeMin + ratio * (rangeMax - rangeMin);
        } else if (scale.type === "band") {
            const index = scale.domain.indexOf(value as any);
            const bandWidth = (rangeMax - rangeMin) / scale.domain.length;
            return rangeMin + index * bandWidth + bandWidth / 2;
        }

        return rangeMin;
    }

    const ticks = generateTicks(scale, tickCount);
    const isHorizontal = axisType === "bottom" || axisType === "top";
    const isTop = axisType === "top";
    const isLeft = axisType === "left";

    // Calculate SVG dimensions
    const svgWidth = isHorizontal ? length + 60 : 150;
    const svgHeight = isHorizontal ? 80 : length + 60;

    // Base transform for the axis group
    const baseTransform = isHorizontal ? `translate(30, ${isTop ? 50 : 30})` : `translate(${isLeft ? 120 : 30}, 30)`;

    // Generate tick elements
    const tickElements = ticks
        .map((tickValue) => {
            const position = scaleValue(tickValue, scale);
            const label = tickFormat(tickValue);

            if (isHorizontal) {
                const tickY1 = isTop ? 0 : 0;
                const tickY2 = isTop ? tickSize : tickSize;
                const labelY = isTop ? -tickPadding : tickSize + tickPadding + 12;

                return `
        <line x1="${position}" y1="${tickY1}" x2="${position}" y2="${tickY2}" stroke=${color} stroke-width="1"/>
        <text x="${position}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif"  fill=${color} font-size="12">${label}</text>
      `;
            } else {
                const tickX1 = isLeft ? 0 : 0;
                const tickX2 = isLeft ? tickSize : tickSize;
                const labelX = isLeft ? -tickPadding : tickSize + tickPadding;
                const textAnchor = isLeft ? "end" : "start";

                return `
        <line x1="${tickX1}" y1="${position}" x2="${tickX2}" y2="${position}" stroke=${color} stroke-width="1"/>
        <text x="${labelX}" y="${
                    position + 4
                }" text-anchor="${textAnchor}" font-family="Arial, sans-serif" fill=${color} font-size="12">${label}</text>
      `;
            }
        })
        .join("");

    // Generate main axis line
    const axisLine = isHorizontal
        ? `<line x1="0" y1=${isTop ? tickSize : 0} x2="${length}" y2=${
              isTop ? tickSize : 0
          } stroke=${color} stroke-width="1"/>`
        : `<line x1=${isLeft ? tickSize : 0} y1="0" x2=${isLeft ? tickSize : 0} y2="${length}" stroke=${color} stroke-width="1"/>`;

    return `
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <g class="axis" transform="${baseTransform}">
    ${axisLine}
    ${tickElements}
  </g>
</svg>
  `.trim();
}
