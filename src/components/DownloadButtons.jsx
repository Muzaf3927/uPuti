import React from "react";
import { useI18n } from "@/app/i18n.jsx";

// Android Icon SVG
const AndroidIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1349 1.0989L4.8429 5.4467a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.186.8535 13.3074.8535 15.8986v.05c0 .4142.3358.75.75.75h20.793c.4142 0 .75-.3358.75-.75v-.05c0-2.5912-1.8354-4.7126-4.2675-5.5772" />
  </svg>
);

// iOS Icon SVG
const IOSIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

function DownloadButtons() {
  const { t } = useI18n();

  return (
    <div className="w-full max-w-md mt-3 flex flex-col gap-2">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-gradient-to-r from-[#3DDC84] to-[#2BB673] hover:from-[#2BB673] hover:to-[#3DDC84] text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
          <AndroidIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs opacity-90">Google Play</div>
          <div className="text-sm font-semibold">{t("download.android")}</div>
        </div>
        <svg
          className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>

      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-gradient-to-r from-[#000000] to-[#1a1a1a] hover:from-[#1a1a1a] hover:to-[#000000] text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
          <IOSIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs opacity-90">App Store</div>
          <div className="text-sm font-semibold">{t("download.ios")}</div>
        </div>
        <svg
          className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  );
}

export default DownloadButtons;

