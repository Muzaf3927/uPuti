import React, { useRef } from "react";
import { useI18n } from "@/app/i18n.jsx";
import { useNavigate } from "react-router-dom";

function DownloadAndroid() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const installText = lang === "ru" ? "Установить для Android" : "Android uchun o'rnatish";

  const handleInstall = () => {
    // 1️⃣ Начать скачивание APK
    const link = document.createElement("a");
    link.href = "/apk/uputi.apk";
    link.download = "uputi.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2️⃣ Запустить видео
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
      <div className="min-h-screen pt-6 pb-10 px-3 flex flex-col items-center">
        <div className="relative w-full max-w-md">
          <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/80 border shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
              aria-label={lang === "ru" ? "Закрыть" : "Yopish"}
          >
            ×
          </button>

          {/* Video */}
          <div className="w-full h-[500px] bg-white/80 border rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
            <div className="relative w-full h-full bg-black">
              <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src="/video/screen.MOV"
                  controls
                  playsInline
              >
                {lang === "ru"
                    ? "Ваш браузер не поддерживает воспроизведение видео."
                    : "Brauzeringiz videoni qo'llab-quvvatlamaydi."}
              </video>
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