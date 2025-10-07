import { useEffect } from "react";

// Скроллит указанный контейнер к началу при фокусе на любом input/textarea/select внутри него
export function useScrollOnFocusToTop(containerRef) {
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const handleFocus = (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      // Поднимаем контейнер к началу
      try {
        el.scrollTo({ top: 0, behavior: "smooth" });
      } catch (_err) {
        el.scrollTop = 0;
      }
    };

    el.addEventListener("focusin", handleFocus);
    return () => el.removeEventListener("focusin", handleFocus);
  }, [containerRef]);
}


