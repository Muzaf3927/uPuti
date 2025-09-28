import React, { useEffect, useRef, useState } from "react";

// redux
import { useDispatch } from "react-redux";
import { login } from "@/app/userSlice/userSlice";

// shadcn ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// lucide icons
import {
  Loader2,
  Eye,
  EyeOff,
  Car,
  Users,
  MapPin,
  User,
  Phone,
  Lock,
  ReceiptIndianRupee,
} from "lucide-react";

// others
import { Link, Navigate } from "react-router-dom";
import { InputMask } from "@react-input/mask";
import { usePostData } from "@/api/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/app/i18n.jsx";

function FogotPassword() {
  const { t, lang, setLang } = useI18n();
  const [form, setForm] = useState({
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const dispatch = useDispatch();

  const fogotPasswordMutationOne = usePostData("/reset-password/step-one");
  const fogotPasswordMutationTwo = usePostData("/reset-password/step-two");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const readyDataRef = useRef({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);

    const phone = formData.get("phone");

    if (!phone) {
      setError("Iltimos raqamingizni kiriting.");
      return;
    }

    // Clean phone number - remove formatting and add +998 prefix
    const cleanPhone = phone.replace(/\D/g, ""); // Remove all non-digits
    const formattedPhone = cleanPhone.startsWith("998")
      ? cleanPhone
      : `${cleanPhone}`;

    const resultData = {
      phone: formattedPhone,
    };

    setLoading(true);
    try {
      const res = await fogotPasswordMutationOne.mutateAsync(resultData);

      readyDataRef.current = res;
      setModal(true);
    } catch (err) {
      if (err.message === "Пароль должен содержать минимум 6 символов") {
        toast.warning("Parol kamida 6 belgidan iborat bo'lishi kerak.");
      }
      setError("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Защита от множественных нажатий
    if (verifyLoading) return;
    
    const formData = new FormData(e.target);

    const verifyText = formData.get("verifyText");
    const password = formData.get("password");
    const password_confirmation = formData.get("password_confirmation");

    if (!verifyText || !password || !password_confirmation) {
      setError("Iltimos hammasini to'ldiring.");
      return;
    }

    if (password !== password_confirmation) {
      setError("Parollar mos emas!");
      return;
    }

    const resultData = {
      password,
      password_confirmation,
      verification_id: readyDataRef.current?.verification_id,
      message: verifyText,
    };

    setVerifyLoading(true);
    setError("");
    
    try {
      const res = await fogotPasswordMutationTwo.mutateAsync(resultData);

      toast.success(t("auth.forgotPassword.successMessage"));
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError("Failed to connect to API.");
    } finally {
      setVerifyLoading(false);
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
              <p className="text-xs sm:text-sm leading-tight">{t("auth.reliableCompanions")}</p>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full h-[70px] sm:h-[80px] py-1">
          <CardHeader className="p-2">
            <CardTitle className="text-green-700 text-xs sm:text-sm text-center flex flex-col items-center gap-1">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-xs sm:text-sm leading-tight">{t("auth.convenientRoutes")}</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="w-full max-w-md -mt-4">
        <CardHeader className="relative p-0.5 sm:p-1">
          <CardTitle className="text-green-700 mx-auto text-lg sm:text-xl font-bold">
            {t("auth.forgotPassword.title")}
          </CardTitle>
          <p className="text-gray-500 mx-auto text-sm">
            {t("auth.forgotPassword.subtitle")}
          </p>
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
              <Label htmlFor="phone" className="text-sm">{t("auth.forgotPassword.phoneLabel")}</Label>
              <div className="relative">
                <InputMask
                  mask="_________"
                  replacement={{ _: /\d/ }}
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    setError("");
                    setSuccess("");
                  }}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder={t("auth.forgotPassword.phonePlaceholder")}
                  required
                  autoComplete="tel"
                  className="pl-20 sm:pl-24 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 sm:h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 sm:file:h-7 file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Phone
                  className="absolute left-2 top-2 text-gray-400"
                  size={16}
                />
                <p className="absolute left-8 sm:left-10 top-1.5 font-normal select-none text-sm">+998</p>
              </div>
            </div>

            {error && <div className="text-red-500 text-xs sm:text-sm">{error}</div>}
            {success && <div className="text-green-600 text-xs sm:text-sm">{success}</div>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 h-8 sm:h-9 text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  {t("auth.forgotPassword.loading")}
                </span>
              ) : (
                t("auth.forgotPassword.button")
              )}
            </Button>
            <div className="flex justify-center items-center text-xs sm:text-sm">
              <p>
                {t("auth.forgotPassword.haveAccount")}{" "}
                <Link className="underline" to="/login">
                  {t("auth.forgotPassword.goLogin")}
                </Link>
              </p>
            </div>
          </form>
          <Dialog open={modal} onOpenChange={setModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("auth.forgotPassword.resetTitle")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleVerify} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 mb-2">
                  <Label htmlFor="verifyText">{t("auth.code")}</Label>
                  <Input
                    type="text"
                    id="verifyText"
                    name="verifyText"
                    placeholder="*********"
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="password">{t("auth.forgotPassword.passwordLabel")}</Label>
                  <div className="relative">
                    <Input
                      autoComplete="new-password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder={t("auth.forgotPassword.passwordPlaceholder")}
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Lock
                      className="absolute left-2 top-2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="password_confirmation">
                    {t("auth.forgotPassword.confirmPasswordLabel")}
                  </Label>
                  <div className="relative">
                    <Input
                      autoComplete="new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      placeholder={t("auth.forgotPassword.confirmPasswordPlaceholder")}
                      value={form.password_confirmation}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                    <Lock
                      className="absolute left-2 top-2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <Button 
                    type="submit" 
                    disabled={verifyLoading}
                    className="w-full"
                  >
                    {verifyLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        {t("auth.signupProgress")}
                      </span>
                    ) : (
                      t("auth.forgotPassword.submitButton")
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default FogotPassword;
