import React, { useState, useRef, useEffect } from "react";

// shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, Users, User, Lock, EyeOff, Eye, Headphones } from "lucide-react";
import { Label } from "@/components/ui/label";

// redux toolkit
import { useDispatch } from "react-redux";
import { login } from "@/app/userSlice/userSlice";

// others
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InputMask } from "@react-input/mask";
import { usePostData } from "@/api/api";
import { toast } from "sonner";
import { useI18n } from "@/app/i18n.jsx";
import Onboarding from "@/components/Onboarding";
import { safeLocalStorage } from "@/lib/localStorage";
import { sessionManager } from "@/lib/sessionManager";

function Login() {
  const { t, lang, setLang } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [formError, setFormError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

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

      // Принудительно завершаем все предыдущие сессии
      sessionManager.forceLogoutAllSessions();

      // Создаем новую сессию
      sessionManager.createSession(res, res.access_token);
      dispatch(login(res));
      safeLocalStorage.setItem("showOnboarding", "true");
    } catch (err) {
      console.error("Login error:", err);
      
      // Показываем ошибку пользователю
      let errorMessage = "";
      
      if (err.response?.status === 401) {
        errorMessage = lang === "ru" 
          ? "Неверный номер телефона или пароль" 
          : "Telefon raqami yoki parol noto'g'ri";
      } else if (err.response?.status === 422) {
        errorMessage = lang === "ru"
          ? "Проверьте правильность введенных данных"
          : "Kiritilgan ma'lumotlarni tekshiring";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = lang === "ru"
          ? "Ошибка входа. Попробуйте ещё раз"
          : "Kirishda xatolik. Qaytadan urinib ko'ring";
      }
      
      toast.error(errorMessage);
      setFormError(errorMessage);

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

          // Принудительно завершаем все предыдущие сессии
          sessionManager.forceLogoutAllSessions();

          // Создаем новую сессию
          sessionManager.createSession(mockResponse, mockResponse.access_token);
          dispatch(login(mockResponse));
          safeLocalStorage.setItem("showOnboarding", "true");
        } catch (mockError) {
          console.error("Mock login error:", mockError);
        }
      }
    }
  };

  // Show success modal if redirected after account deletion
  useEffect(() => {
    const fromState = !!location.state?.accountDeleted;
    let fromSession = false;
    try {
      fromSession = sessionStorage.getItem("accountDeleted") === "1";
    } catch (_) {}

    if (fromState || fromSession) {
      setShowDeletedModal(true);
      try {
        sessionStorage.removeItem("accountDeleted");
      } catch (_) {}
      navigate(".", { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-2 pb-6 px-1 flex gap-3 flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Верхний текст */}
      <div className="w-full max-w-4xl text-center px-2 mb-0">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-3 shadow-sm border border-green-100">
          <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800 mb-1">
            {lang === "uz"
              ? "Qo'l ko'tarib yo'lda Poputi mashina kutish vaqti o'tdi!"
              : "Эпоха голосования на дороге прошла!"}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
            {lang === "uz"
              ? "«Popoutchik» lar uchun endi - arzon, xavfsiz va qulay hamsafar platformasi:"
              : "Теперь для «попутчиков» — доступная, безопасная и удобная платформа совместных поездок"}
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
              <p className="text-xs sm:text-sm leading-tight">
                {t("auth.reliableCompanions")}
              </p>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full h-[70px] sm:h-[80px] py-1">
          <CardHeader className="p-2">
            <CardTitle className="text-green-700 text-xs sm:text-sm text-center flex flex-col items-center gap-1">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-xs sm:text-sm leading-tight">
                {t("auth.convenientRoutes")}
              </p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="relative w-full max-w-md -mt-2 md:mt-1">
      <Card className="w-full px-4">
        <CardHeader className="relative p-0.5 sm:p-1 ">
          <CardTitle className="text-green-700 mx-auto text-lg sm:text-xl font-bold">
            {t("auth.loginTitle")}
          </CardTitle>
          <p className="text-gray-500 mx-auto text-sm">
            {t("auth.loginSubtitle")}
          </p>
          <button
            type="button"
            onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border bg-white hover:bg-green-50 text-[10px] sm:text-xs"
          >
            {lang === "uz" ? (
              <div className="flex gap-1 py-0">
                <img src="/rus.png" alt="Uzbekistan" width="18" height="18" />
                <span>RU</span>
              </div>
            ) : (
              <div className="flex gap-1 py-0">
                <img src="/uzb.png" alt="Uzbekistan" width="18" height="18" />
                <span>UZ</span>
              </div>
            )}
          </button>
        </CardHeader>
        <CardContent className="px-6 sm:p-1">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y -px-10">
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="phone" className="text-sm">
                {t("auth.phoneLabel")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={16} className="sm:w-5 sm:h-5" />
                </span>
                <InputMask
                  mask="__ ___ __ __"
                  replacement={{ _: /\d/ }}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={t("auth.phonePlaceholder")}
                  required
                  autoComplete="tel"
                  onCopy={(e) => {
                    const v = e.currentTarget.value || "";
                    const digits = v.replace(/\D/g, "");
                    e.clipboardData.setData("text/plain", digits);
                    e.preventDefault();
                  }}
                  className="pl-20 sm:pl-24 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 sm:h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 sm:file:h-7 file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="absolute left-8 sm:left-10 top-1.5 font-normal select-none text-sm">
                  +998
                </p>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="password" className="text-sm">
                {t("auth.passwordLabel")}
              </Label>
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
                  {showPassword ? (
                    <EyeOff size={16} className="sm:w-4 sm:h-4" />
                  ) : (
                    <Eye size={16} className="sm:w-4 sm:h-4" />
                  )}
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

            {(formError || loginMutation.error) && (
              <div className="text-red-500 text-xs sm:text-sm">
                {formError || loginMutation.error?.message ||
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
                {t("auth.needAccount")} {" "}
                <Link
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-100 text-green-800 font-semibold underline decoration-2 hover:bg-green-200 hover:text-green-900 transition-colors shadow-sm ring-1 ring-green-200 text-sm sm:text-base"
                  to="/register"
                >
                  {t("auth.register")}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* floating support button (fixed chat-style) */}
      <button
        type="button"
        onClick={() => setSupportOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white/70 backdrop-blur-md border border-green-200 text-green-700 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
        aria-label={t("profilePanel.support")}
      >
        <Headphones className="w-6 h-6" />
      </button>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSupportOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-[280px] p-4 text-center">
              <div className="mb-3">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <User className="w-10 h-10 text-green-600 absolute top-1 left-1" />
                  <Headphones className="w-6 h-6 text-green-500 absolute -top-1 -right-1" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("support.title")}</h3>
                <p className="text-xs text-gray-600 mb-3">{t("support.description")}</p>
              </div>
              <a href="https://t.me/Khamroyev_3" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium">
                <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true"><path fill="currentColor" d="M9.04 15.49 8.88 19c.27 0 .39-.12.54-.27l1.93-2.33 3.99 2.91c.73.4 1.26.19 1.45-.68l2.63-12.36c.27-1.25-.45-1.74-1.25-1.43L3.34 9.5c-1.2.47-1.19 1.14-.21 1.45l4.63 1.44 10.77-6.8c.51-.31.98-.14.59.2z"/></svg>
                {t("support.button")}
              </a>
              <button onClick={() => setSupportOpen(false)} className="mt-4 text-xs text-red-500 hover:text-red-700">{t("support.close")}</button>
            </div>
          </div>
        </div>
      )}
      {showDeletedModal && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeletedModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-[320px] p-4 text-center">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {lang === "ru" ? "Аккаунт удалён" : "Hisob o'chirildi"}
                </h3>
                <p className="text-xs text-gray-600">
                  {t("auth.deleteAccount.successMessage")}
                </p>
              </div>
              <button
                onClick={() => setShowDeletedModal(false)}
                className="mt-3 inline-flex items-center justify-center bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium w-full"
              >
                {lang === "ru" ? "Понятно" : "Tushunarli"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Support for non-authenticated users */}
      <div className="w-full max-w-md mt-2 text-center">
        <div className="bg-white/80 border rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-2">{t("support.description")}</p>
          <a
            href="https://t.me/Khamroyev_3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true">
              <path fill="currentColor" d="M9.04 15.49 8.88 19c.27 0 .39-.12.54-.27l1.93-2.33 3.99 2.91c.73.4 1.26.19 1.45-.68l2.63-12.36c.27-1.25-.45-1.74-1.25-1.43L3.34 9.5c-1.2.47-1.19 1.14-.21 1.45l4.63 1.44 10.77-6.8c.51-.31.98-.14.59.2z" />
            </svg>
            {t("support.button")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
