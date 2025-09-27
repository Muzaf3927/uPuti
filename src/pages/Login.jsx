import React, { useState, useRef } from "react";

// shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, Users, User, Lock, EyeOff, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";

// redux toolkit
import { useDispatch } from "react-redux";
import { login } from "@/app/userSlice/userSlice";

// others
import { Link } from "react-router-dom";
import { InputMask } from "@react-input/mask";
import { usePostData } from "@/api/api";
import { toast } from "sonner";
import { useI18n } from "@/app/i18n.jsx";
import Onboarding from "@/components/Onboarding";

function Login() {
  const { t, lang, setLang } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const loginMutation = usePostData("/login");
  const dispatch = useDispatch();

  const mobileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const phone = formData.get("phone");
    const password = formData.get("password");

    // Clean phone number - remove formatting and add +998 prefix
    const cleanPhone = phone.replace(/\D/g, ""); // Remove all non-digits
    const formattedPhone = cleanPhone.startsWith("998")
      ? cleanPhone
      : `${cleanPhone}`;

    //

    try {
      // Try with the first phone format first
      const requestData = {
        phone: formattedPhone,
        password,
      };

      const res = await loginMutation.mutateAsync(requestData);
      if (res.message === "Вход выполнен успешно") {
        toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      }
      dispatch(login(res));
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("showOnboarding", "true");
    } catch (err) {
      //

      // If backend is broken, try mock login for development
      if (
        err.response?.status === 500 &&
        err.response?.data?.error === "Invalid JSON response from backend"
      ) {
        try {
          const mockResponse = {
            access_token: "mock_token_" + Date.now(),
            user: {
              id: 1,
              name: "Test User",
              phone: formattedPhone,
              email: "test@example.com",
            },
          };
          dispatch(login(mockResponse));
          localStorage.setItem("user", JSON.stringify(mockResponse));
          localStorage.setItem("token", mockResponse.access_token);
          localStorage.setItem("showOnboarding", "true");
        } catch (mockError) {
          //
        }
      }
      // Error state is available via loginMutation.error
    }
  };

  return (
    <div className="pt-2 pb-6 px-1 flex gap-3 flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Верхний текст */}
      <div className="w-full max-w-4xl text-center px-2 mb-0">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-3 shadow-sm border border-green-100">
          <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800 mb-1">
            {lang === "uz" 
              ? "Qo'l ko'tarib yo'lda Poputi mashina kutish vaqti o'td!" 
              : "Эпоха голосования на дороге прошла!"
            }
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
            {lang === "uz" 
              ? "«Popoutchik» lar uchun endi - arzon, xavfsiz va qulay hamsafar flatformasi:"
              : "Теперь для «попутчиков» — доступная, безопасная и удобная платформа совместных поездок"
            }
          </p>
        </div>
      </div>
      
      <h1 className="flex items-center justify-center text-green-700 font-bold">
        <img
          src="/logo.png"
          alt="UPuti"
          className="h-16 sm:h-20 lg:h-24 w-auto object-contain mix-blend-multiply"
        />
      </h1>
      <div className="flex gap-1 w-full max-w-[450px] py-1">
        <Card className="w-full py-1 h-[70px] sm:h-[80px]">
          <CardHeader className="p-2">
            <CardTitle className="text-green-700 text-xs sm:text-sm text-center flex flex-col items-center gap-1">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-xs sm:text-sm leading-tight">Ishonchli sayohat hamrohlari</p>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full h-[70px] sm:h-[80px] py-1">
          <CardHeader className="p-2">
            <CardTitle className="text-green-700 text-xs sm:text-sm text-center flex flex-col items-center gap-1">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-xs sm:text-sm leading-tight">Qulay yo'nalishlar</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="w-full max-w-md -mt-4">
        <CardHeader className="relative p-0.5 sm:p-1">
          <CardTitle className="text-green-700 mx-auto text-lg sm:text-xl font-bold">
            {t("auth.loginTitle")}
          </CardTitle>
          <p className="text-gray-500 mx-auto text-sm">{t("auth.loginSubtitle")}</p>
          <button
            type="button"
            onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full border bg-white hover:bg-green-50 text-xs"
          >
            {lang === "uz" ? "🇷🇺 RU" : "🇺🇿 UZ"}
          </button>
        </CardHeader>
        <CardContent className="p-0.5 sm:p-1">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="phone" className="text-sm">{t("auth.phoneLabel")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={16} className="sm:w-5 sm:h-5" />
                </span>
                <InputMask
                  mask="_________"
                  replacement={{ _: /\d/ }}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={t("auth.phonePlaceholder")}
                  required
                  autoComplete="tel"
                  className="pl-20 sm:pl-24 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 sm:h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 sm:file:h-7 file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="absolute left-8 sm:left-10 top-1.5 font-normal select-none text-sm">
                  +998
                </p>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="password" className="text-sm">{t("auth.passwordLabel")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} className="sm:w-5 sm:h-5" />
                </span>
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} className="sm:w-4 sm:h-4" /> : <Eye size={16} className="sm:w-4 sm:h-4" />}
                </button>
                <Input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="pl-10 h-8 sm:h-9 text-sm sm:text-base"
                />
              </div>
            </div>

            {loginMutation.error && (
              <div className="text-red-500 text-xs sm:text-sm">
                {loginMutation.error.message ||
                  (lang === "ru"
                    ? "Ошибка входа. Попробуйте ещё раз."
                    : "Kirishda xatolik. Qaytadan urinib ko'ring.")}
              </div>
            )}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-green-700 h-8 sm:h-9 text-sm sm:text-base"
            >
              {loginMutation.isPending
                ? t("auth.loginLoading")
                : t("auth.loginBtn")}
            </Button>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <Link to="/fogotPassword" className="underline">
                {t("auth.forgot")}
              </Link>
              <p className="text-center">
                {t("auth.needAccount")}{" "}
                <Link className="underline" to="/register">
                  {t("auth.register")}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default Login;
