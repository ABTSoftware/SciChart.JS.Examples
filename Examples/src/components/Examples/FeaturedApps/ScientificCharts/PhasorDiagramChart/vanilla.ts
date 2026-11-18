import { createExample } from "./createExample";

const root = document.getElementById("chart") as HTMLDivElement;
const demo = createExample(root);
window.addEventListener("pagehide", demo.dispose, { once: true });
