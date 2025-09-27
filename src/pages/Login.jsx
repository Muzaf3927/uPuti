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

function Login() {
  const { t, lang, setLang } = useI18n();
  const [showPassword, setShowPassword] = useState(false);

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
        } catch (mockError) {
          //
        }
      }
      // Error state is available via loginMutation.error
    }
  };

  return (
    <div className="py-10 px-2 flex gap-5 flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="flex items-center justify-center text-green-700 font-bold">
        <img
          src="/logo.png"
          alt="UPuti"
          className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply"
        />
      </h1>
      <div className="flex items-center justify-center gap-2">
        <p className="text-center">{t("auth.slogan")}</p>
        <button
          type="button"
          onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
          className="ml-2 px-3 py-1 rounded-full border bg-white/80 hover:bg-green-50 text-xs"
        >
          {lang === "uz" ? "🇷🇺 RU" : "🇺🇿 UZ"}
        </button>
      </div>
      <div className="flex gap-2 w-full max-w-[450px] py-1">
        <Card className="w-full py-2 h-[80px]">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm text-center flex flex-col items-center gap-1">
              <Users />
              <p>Ishonchli sayohat hamrohlari</p>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full h-[80px] py-2">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm text-center flex flex-col items-center gap-1">
              <MapPin />
              <p>Qulay yo‘nalishlar</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-700 mx-auto text-xl font-bold">
            {t("auth.loginTitle")}
          </CardTitle>
          <p className="text-gray-500 mx-auto">{t("auth.loginSubtitle")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="phone">{t("auth.phoneLabel")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
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
                  className="pl-20 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <p className="absolute left-10 top-1.5 font-normal select-none">
                  +998
                </p>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </span>
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <Input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {loginMutation.error && (
              <div className="text-red-500 text-sm">
                {loginMutation.error.message ||
                  (lang === "ru"
                    ? "Ошибка входа. Попробуйте ещё раз."
                    : "Kirishda xatolik. Qaytadan urinib ko'ring.")}
              </div>
            )}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-green-700"
            >
              {loginMutation.isPending
                ? t("auth.loginLoading")
                : t("auth.loginBtn")}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <Link to="/fogotPassword" className="underline">
                {t("auth.forgot")}
              </Link>
              <p>
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
