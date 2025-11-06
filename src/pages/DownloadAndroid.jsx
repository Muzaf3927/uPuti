import React from "react";
import { useI18n } from "@/app/i18n.jsx";
import { useNavigate } from "react-router-dom";

function DownloadAndroid() {
  const { lang } = useI18n();
  const navigate = useNavigate();

  const installText = lang === "ru" ? "Установить для Android" : "Android uchun o'rnatish";

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
        <h1 className="text-center text-lg font-semibold mb-3">
          {lang === "ru" ? "Загрузка для Android" : "Android uchun yuklash"}
        </h1>

        {/* Placeholder for video (screen recording) */}
        <div className="w-full bg-white/80 border rounded-2xl shadow-sm overflow-hidden">
          <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-gray-400">
            {lang === "ru" ? "Здесь будет видео" : "Bu yerda video bo'ladi"}
          </div>
          <div className="p-3 text-xs text-gray-500">
            {lang === "ru"
              ? "Под видео будет описание/инструкции (при необходимости)."
              : "Video ostida kerak bo'lsa, tavsif/ko'rsatmalar bo'ladi."}
          </div>
        </div>

        {/* Install button */}
        <a
          href="/apk/uputi.apk"
          download="uputi.apk"
          className="mt-4 w-full bg-gradient-to-r from-[#3DDC84] to-[#2BB673] text-white font-semibold py-3 rounded-xl shadow-lg hover:brightness-110 transition block text-center"
        >
          {installText}
        </a>
      </div>
    </div>
  );
}

export default DownloadAndroid;


