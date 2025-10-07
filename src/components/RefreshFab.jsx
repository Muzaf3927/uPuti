import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

  const button = (
    <button
      onClick={handleClick}
      aria-label="Refresh"
      className="fixed right-4 z-[1000] rounded-full text-white active:scale-95 transition size-11 flex items-center justify-center shadow-lg pointer-events-auto"
      style={{
        bottom: (offsetBottom || 88) + (keyboardInset || 0),
        backgroundColor: "rgba(22, 163, 74, 0.75)", // зелёный с прозрачностью
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(21, 128, 61, 0.25)",
      }}
    >
      <span className={loading ? "animate-spin" : ""}>
        <RotateCw size={18} />
      </span>
    </button>
  );

  // Рендерим через портал в body, чтобы не зависеть от иерархии layout и overflow
  return createPortal(button, document.body);
}


