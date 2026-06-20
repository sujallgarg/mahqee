import { useEffect, useState, RefObject } from "react";

export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress starting from when the top of the element enters the viewport 
      // to when the bottom of the element leaves the viewport.
      const totalDist = rect.height + viewportHeight;
      const currentDist = viewportHeight - rect.top;
      
      // Calculate percentage
      let pct = currentDist / totalDist;
      
      // Clamp to [0, 1]
      pct = Math.max(0, Math.min(1, pct));
      
      setProgress(pct);
    };

    // Calculate initial progress
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);

  return progress;
}
