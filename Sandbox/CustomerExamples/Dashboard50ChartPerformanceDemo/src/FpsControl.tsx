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
        color: "#333",
        fontFamily: "Arial",
        marginLeft: "auto",
      }}
    >
      FPS: {fps.toFixed(2)}
    </div>
  );
};
