import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/app/i18n.jsx";
import { Car, Users, MapPin, CheckCircle } from "lucide-react";

function Onboarding({ onComplete, setLang }) {
  const { t, lang } = useI18n();

  const isUzbek = lang === "uz";

  const content = {
    uz: {
      title: "UPuti ga xush kelibsiz!",
      subtitle: "Bu yerda yo'lovchilar va haydovchilar bir-birini topadilar.",
      description:
        "Siz tezda safar yaratishingiz yoki poputka topishingiz mumkin.",
      passengerTitle: "Yo'lovchilar uchun:",
      passengerDesc:
        "kerakli yo'nalish bo'yicha safarni toping — taksidan arzonroq va qulayroq.",
      driverTitle: "Haydovchilar uchun:",
      driverDesc:
        "kim bilan ketishingizni oldindan biling va benzin xarajatini qoplang.",
      cta: "👉 Ortiqcha tashvishlarsiz: bron qiling va yo'lga chiqing!",
      button: "Boshlash",
    },
    ru: {
      title: "Добро пожаловать в UPuti!",
      subtitle: "Здесь пассажиры и водители находят друг друга.",
      description: "Вы можете быстро создать поездку или найти попутку.",
      passengerTitle: "Для пассажиров:",
      passengerDesc:
        "найдёшь поездку по нужному маршруту дешевле и удобнее, чем такси или автобус.",
      driverTitle: "Для водителей:",
      driverDesc: "заранее знаешь, кто поедет с тобой, и экономишь на бензине.",
      cta: "👉 Без лишних хлопот: бронируй и езжай!",
      button: "Начать",
    },
  };

  const currentContent = content[isUzbek ? "uz" : "ru"];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm relative max-h-[95vh] overflow-y-auto">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Кнопка переключения языков */}
          <button
            type="button"
            onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full border bg-white hover:bg-green-50 text-xs font-medium shadow-sm"
          >
            {lang === "uz" ? (
              <div className="flex gap-1 py-1">
                <img src="/rus.png" alt="Uzbekistan" width="24" height="24" />
                <span>RU</span>
              </div>
            ) : (
              <div className="flex gap-1 py-1">
                <img src="/uzb.png" alt="Uzbekistan" width="24" height="24" />
                <span>UZ</span>
              </div>
            )}
          </button>

          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img
                src="/logo.png"
                alt="UPuti"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-2 sm:mb-3">
              {currentContent.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">
              {currentContent.subtitle}
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              {currentContent.description}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6 mb-4 sm:mb-6 lg:mb-8">
            {/* Пассажиры */}
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                  {currentContent.passengerTitle}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {currentContent.passengerDesc}
                </p>
              </div>
            </div>

            {/* Водители */}
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-xl">
              <div className="flex-shrink-0">
                <Car className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                  {currentContent.driverTitle}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {currentContent.driverDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700">
              {currentContent.cta}
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold shadow-lg w-full sm:w-auto"
            >
              {currentContent.button}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Onboarding;
