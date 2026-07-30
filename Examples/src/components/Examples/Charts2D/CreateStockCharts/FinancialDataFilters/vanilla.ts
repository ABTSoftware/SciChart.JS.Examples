import { drawExample } from "./drawExample";

const getElement = (id: string) => document.getElementById(id) as HTMLElement;

drawExample("chart").then((chartApi) => {
    getElement("source").onclick = () => chartApi.setFilterMode("source");
    getElement("heikinAshi").onclick = () => chartApi.setFilterMode("heikinAshi");
    getElement("renko").onclick = () => chartApi.setFilterMode("renko");
    getElement("pointAndFigure").onclick = () => chartApi.setFilterMode("pointAndFigure");
});
