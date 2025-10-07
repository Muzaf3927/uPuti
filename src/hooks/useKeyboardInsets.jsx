import { useEffect, useState } from "react";

export function useKeyboardInsets() {
  const [viewportHeight, setViewportHeight] = useState(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      setViewportHeight(Math.floor(vv.height));
      const inset = Math.max(0, window.innerHeight - Math.floor(vv.height));
      setKeyboardInset(inset);
    };

    handleResize();
    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  return { viewportHeight, keyboardInset };
}


