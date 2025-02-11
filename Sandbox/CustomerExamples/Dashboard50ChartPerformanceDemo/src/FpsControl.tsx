import React, { useEffect, useState } from "react";

export const FpsControl: React.FC = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const fpsBuffer: number[] = [];
    let frameCount = 0;
    let lastTime = performance.now();
    let lastUpdateTime = lastTime;

    const calculateFps = () => {
      frameCount++;
      const currentTime = performance.now();

      // Update FPS every 500ms
      if (currentTime - lastUpdateTime >= 500) {
        const fps = (frameCount * 1000) / (currentTime - lastUpdateTime);

        // Add to buffer
        fpsBuffer.push(fps);
        if (fpsBuffer.length > 10) {
          fpsBuffer.shift();
        }

        // Calculate average
        const averageFps =
          fpsBuffer.reduce((a, b) => a + b, 0) / fpsBuffer.length;
        setFps(averageFps);

        // Reset counters
        frameCount = 0;
        lastUpdateTime = currentTime;
      }

      requestAnimationFrame(calculateFps);
    };

    const animationFrame = requestAnimationFrame(calculateFps);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: 20,
        padding: "20px",
        backgroundColor: "rgba(70, 130, 180, 0.5)",
        border: "1px solid white",
        color: "white",
        borderRadius: "4px",
        fontFamily: "Arial",
        zIndex: 1000,
      }}
    >
      FPS: {fps.toFixed(2)}
    </div>
  );
};
