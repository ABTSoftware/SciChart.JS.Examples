export const updateGoogleTagManagerPage = () => {
    if (typeof window !== "undefined") {
        // @ts-ignore
        if (window.dataLayer)
            // @ts-ignore
            window.dataLayer.push({
                event: "pageview"
            });
    }
};
