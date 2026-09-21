import { useEffect, useState } from "react";

export function Stats() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();

    let animationFrame: number;

    const loop = () => {
      frames++;

      const now = performance.now();

      if (now - lastTime >= 1000) {
        setFps(frames);

        frames = 0;
        lastTime = now;
      }

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div>
      FPS: <span style={{ color: fps >= 60 ? "green" : "red" }}>{fps}</span>
    </div>
  );
}
