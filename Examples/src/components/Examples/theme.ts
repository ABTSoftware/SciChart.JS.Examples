import { IThemeProvider, SciChartJsNavyTheme } from "scichart";

const getCssColor = (cssVar: string, fallback: string): string => {
    if (typeof document === "undefined") {
        return fallback;
    }
    const cssValue = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    return cssValue || fallback;
};

type TRgbColor = { r: number; g: number; b: number };

const parseCssColorToRgb = (color: string): TRgbColor | undefined => {
    const trimmed = color.trim();

    if (trimmed.startsWith("#")) {
        let hex = trimmed.slice(1);
        if (hex.length === 3 || hex.length === 4) {
            hex = hex
                .slice(0, 3)
                .split("")
                .map((channel) => channel + channel)
                .join("");
        } else if (hex.length === 6 || hex.length === 8) {
            hex = hex.slice(0, 6);
        } else {
            return undefined;
        }

        if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
            return undefined;
        }

        return {
            r: Number.parseInt(hex.slice(0, 2), 16),
            g: Number.parseInt(hex.slice(2, 4), 16),
            b: Number.parseInt(hex.slice(4, 6), 16),
        };
    }

    const rgbMatch = trimmed.match(/^rgba?\((.+)\)$/i);
    if (!rgbMatch) {
        return undefined;
    }

    const channels = rgbMatch[1]
        .split(",")
        .slice(0, 3)
        .map((channel) => Number.parseFloat(channel.trim()));

    if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
        return undefined;
    }

    const clamp = (value: number) => Math.max(0, Math.min(255, value));

    return {
        r: clamp(channels[0]),
        g: clamp(channels[1]),
        b: clamp(channels[2]),
    };
};

const getPerceivedBrightness = (color: string): number | undefined => {
    const rgb = parseCssColorToRgb(color);
    if (!rgb) return undefined;

    // WCAG-adjacent perceptual weighting for quick dark/light detection.
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
};

export interface AppThemeBase {
    SciChartJsTheme: IThemeProvider;

    // general colors
    isDark: boolean;
    ForegroundColor: string;
    Background: string;

    // Series colors
    VividSkyBlue: string;
    VividPink: string;
    VividTeal: string;
    VividOrange: string;
    VividBlue: string;
    VividPurple: string;
    VividGreen: string;
    VividRed: string;

    MutedSkyBlue: string;
    MutedPink: string;
    MutedTeal: string;
    MutedOrange: string;
    MutedBlue: string;
    MutedPurple: string;
    MutedRed: string;

    PaleSkyBlue: string;
    PalePink: string;
    PaleTeal: string;
    PaleOrange: string;
    PaleBlue: string;
    PalePurple: string;
}

export class SciChart2022AppTheme implements AppThemeBase {
    SciChartJsTheme = new SciChartJsNavyTheme();

    // Dynamic colors
    get isDark() {
        const brightness = getPerceivedBrightness(this.Background);
        return brightness === undefined || brightness < 128;
    }
    get TextColor() { return this.ForegroundColor; }
    get ForegroundColor() {
        return getCssColor("--text", "#F5F5F5");
    }
    get Background() {
        return getCssColor("--bg-chart", this.SciChartJsTheme.sciChartBackground);
    }

    // Series colors
    VividSkyBlue = "#50C7E0";
    VividPink = "#EC0F6C";
    VividTeal = "#30BC9A";
    VividOrange = "#F48420";
    VividBlue = "#364BA0";
    VividPurple = "#882B91";
    VividGreen = "#67BDAF";
    VividRed = "#C52E60";

    DarkIndigo = "#14233C";
    Indigo = "#264B93";

    MutedSkyBlue = "#83D2F5";
    MutedPink = "#DF69A8";
    MutedTeal = "#7BCAAB";
    MutedOrange = "#E7C565";
    MutedBlue = "#537ABD";
    MutedPurple = "#A16DAE";
    MutedRed = "#DC7969";

    PaleSkyBlue = "#E4F5FC";
    PalePink = "#EEB3D2";
    PaleTeal = "#B9E0D4";
    PaleOrange = "#F1CFB5";
    PaleBlue = "#B5BEDF";
    PalePurple = "#CFB4D5";
}

export const appTheme = new SciChart2022AppTheme();
