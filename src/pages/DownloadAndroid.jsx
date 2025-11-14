import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/app/i18n.jsx";
import { useNavigate } from "react-router-dom";
import { useTrackDownloadCount } from "@/api/api";

function DownloadAndroid() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const trackDownload = useTrackDownloadCount();

  const installText =
    lang === "ru" ? "Установить для Android" : "Android uchun o'rnatish";

  const handleInstall = async () => {
    // 1️⃣ Отправить запрос на бек для отслеживания скачивания
    try {
      await trackDownload.mutateAsync("android");
    } catch (error) {
      // Ошибка отслеживания не должна блокировать скачивание
      console.error("Failed to track Android download:", error);
    }

    // 2️⃣ Начать скачивание APK
    const link = document.createElement("a");
    link.href = "/apk/uputi.apk";
    link.download = "uputi.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3️⃣ Запустить видео
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleLoadedData = () => {
      setIsVideoReady(true);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.preload = "auto";
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  const handleClose = () => {
    if (window.opener) {
      window.close();
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-10 px-3 flex flex-col items-center">
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 h-10 w-10 rounded-full bg-gray-900/90 text-white border border-white/40 shadow-md flex items-center justify-center text-lg hover:bg-gray-900"
          aria-label={lang === "ru" ? "Закрыть" : "Yopish"}
        >
          ×
        </button>

        {/* Video */}
        <div className="w-full h-[500px] bg-white/80 border rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              src="/video/screen.MOV"
              controls
              preload="auto"
              playsInline
              onLoadedData={() => setIsVideoReady(true)}
            >
              {lang === "ru"
                ? "Ваш браузер не поддерживает воспроизведение видео."
                : "Brauzeringiz videoni qo'llab-quvvatlamaydi."}
            </video>

            {!isVideoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-white text-sm opacity-80">
                  {lang === "ru"
                    ? "Загружаем видео..."
                    : "Video yuklanmoqda..."}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Install button — скачивание + воспроизведение видео */}
        <button
          onClick={handleInstall}
          className="mt-4 w-full bg-gradient-to-r from-[#3DDC84] to-[#2BB673] text-white font-semibold py-3 rounded-xl shadow-lg hover:brightness-110 transition block"
        >
          {installText}
        </button>
      </div>
    </div>
  );
}

export default DownloadAndroid;