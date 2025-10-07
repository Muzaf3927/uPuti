import React, { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

export default function RefreshFab({ onRefresh, showAfter = 80, keyboardInset = 0, alwaysVisible = false, offsetBottom = 88 }) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastClickAtRef = useRef(0);

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > showAfter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter, alwaysVisible]);

  const handleClick = async () => {
    const now = Date.now();
    if (loading || now - lastClickAtRef.current < 2000) return;
    lastClickAtRef.current = now;

    // сохраняем позицию прокрутки
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    setLoading(true);
    try {
      await onRefresh?.();
    } finally {
      setLoading(false);
      // восстанавливаем позицию прокрутки
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: currentScrollY, behavior: "instant" });
      });
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Refresh"
      className="fixed right-4 z-[100] rounded-full bg-green-600/70 text-white backdrop-blur-md hover:bg-green-600/80 active:scale-95 transition size-11 flex items-center justify-center shadow-lg pointer-events-auto ring-1 ring-green-700/20"
      style={{ bottom: (offsetBottom || 88) + (keyboardInset || 0) }}
    >
      <span className={loading ? "animate-spin" : ""}>
        <RotateCw size={18} />
      </span>
    </button>
  );
}


