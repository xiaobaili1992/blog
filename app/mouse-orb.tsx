"use client";

import { useEffect } from "react";

export default function MouseOrb() {
  useEffect(() => {
    const root = document.documentElement;
    const setPosition = (x: number, y: number) => {
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
    };

    setPosition(window.innerWidth * 0.55, window.innerHeight * 0.3);

    const handlePointerMove = (event: PointerEvent) => {
      setPosition(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <div className="mouse-orb" aria-hidden />;
}
