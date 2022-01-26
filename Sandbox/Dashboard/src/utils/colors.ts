export const colors: IColors = {
    dark: "rgba(28, 34, 50, 1)",
    primary: "rgba(19, 174, 255, 1)",
    primaryLight: "rgba(19, 174, 255, .1)",
    secondary: "rgba(186, 103, 157, 1)",
    text: "rgba(255, 255, 255, 1)",
    transparent: "rgba(0, 0, 0, 0)",
    blueSchema: {
        "50": "#e1f5fe",
        "100": "#b3e5fc",
        "200": "#81d4fa",
        "300": "#4fc3f7",
        "400": "#29b6f6",
        "500": "#03a9f4",
        "600": "#039be5",
        "700": "#0288d1",
        "800": "#0277bd",
        "900": "#01579b"
    },
    green: "rgba(128, 226, 126, 1)"
};

export interface IColors {
    dark: string;
    primary: string;
    primaryLight: string;
    secondary: string;
    text: string;
    transparent: string;
    blueSchema: { [key: string]: string };
    green: string;
}
