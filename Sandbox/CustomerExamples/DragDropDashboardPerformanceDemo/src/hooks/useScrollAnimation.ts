import { useEffect, useRef } from "react";

export const useScrollAnimation = () => {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const scrollToBottom = () => {
      const container = document.querySelector(".App");
      if (container) {
        const scrollHeight = container.scrollHeight;
        container.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
        console.log(`scrolling down to ${scrollHeight}`);
      }
    };

    const scrollToTop = () => {
      const container = document.querySelector(".App");
      if (container) {
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        console.log(`scrolling up`);
      }
    };

    // Execute the scroll sequence
    setTimeout(() => {
      scrollToBottom();
      // Wait for scroll down + 1 second pause
      setTimeout(() => {
        scrollToTop();
      }, 1500); // Increased to 1.5s to ensure bottom scroll completes
    }, 1000);
  }, []);
};
