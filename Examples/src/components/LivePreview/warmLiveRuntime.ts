import { baseAppPath } from "../../constants";

let warmed = false;

/** Starts downloading the live frame's runtime so it is in the HTTP cache when the first run needs it. */
export const warmLiveRuntime = () => {
    if (warmed) return;
    warmed = true;
    const frameUrl = `${baseAppPath}/live-frame`;
    fetch(frameUrl)
        .then((response) => response.text())
        .then((html) => {
            const script = /<script src="([^"]+)"/.exec(html)?.[1];
            if (!script) return undefined;
            return fetch(new URL(script, new URL(frameUrl, window.location.href)).href);
        })
        .catch(() => {
            warmed = false; // try again on the next hover
        });
};
