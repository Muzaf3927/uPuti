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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { Link } from "react-router-dom";
import { Headphones } from "lucide-react";
import { InputMask } from "@react-input/mask";
import { usePostData } from "@/api/api";
import { toast } from "sonner";
import { useI18n } from "@/app/i18n.jsx";
import { safeLocalStorage } from "@/lib/localStorage";

function Register() {
  const { t, lang, setLang } = useI18n();
  const [supportOpen, setSupportOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
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

  const registerMutation = usePostData("/register");
  const verifyMuatation = usePostData("/verify");

  const registerDataRef = useRef({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);

    const phone = formData.get("phone");
    const name = formData.get("name");
    const password = formData.get("password");
    const password_confirmation = formData.get("password_confirmation");

    if (!name || !phone || !password || !password_confirmation) {
      setError(t("auth.fillAllFields"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (password !== password_confirmation) {
      setError(t("auth.passwordsNotMatch"));
      return;
    }

    // Clean phone number - remove formatting and add +998 prefix
    const cleanPhone = phone.replace(/\D/g, ""); // Remove all non-digits
    const formattedPhone = cleanPhone.startsWith("998")
      ? cleanPhone
      : `${cleanPhone}`;

    const resultData = {
      name,
      phone: formattedPhone,
      password,
      password_confirmation,
    };

    setLoading(true);
    try {
      const res = await registerMutation.mutateAsync(resultData);
      registerDataRef.current = res;
      setModal(true);
      toast.success("Raqamingizga yuborilgan textni kiriting!");
    } catch {
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

    if (!verifyText) {
      setError("Iltimos kodni kiriting.");
      return;
    }

    const resultData = {
      verification_id: registerDataRef.current?.verification_id,
      code: verifyText,
    };

    setVerifyLoading(true);
    setError("");

    try {
      const res = await verifyMuatation.mutateAsync(resultData);

      dispatch(login(res));
      safeLocalStorage.setItem("token", res?.access_token);
      safeLocalStorage.setItem("showOnboarding", "true");
      toast.success("Muvaffaqiyatli royhatdan o'tdingiz!");

      setSuccess("Registration successful!");
    } catch (err) {
      setError("Failed to connect to API.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="pt-0 pb-6 px-1 flex gap-3 flex-col items-center justify-start min-h-screen">
      
      <h1 className="flex items-center justify-center text-primary font-bold">
        <img
          src="/logo.png"
          alt="UPuti"
          className="h-28 sm:h-32 lg:h-40 w-auto object-contain mix-blend-multiply"
        />
      </h1>
      
      <div className="relative w-full max-w-md -mt-2 md:mt-4">
      <Card
        className="w-full px-4 relative border rounded-2xl ring-1 ring-blue-200/60 shadow-[0_9px_24px_rgba(59,130,246,0.15)]"
        style={{ backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(79,70,229,0.12))" }}
      >
        <CardHeader className="relative p-0.5 sm:p-1">
          <CardTitle className="text-primary mx-auto text-lg sm:text-xl font-bold">
            {t("auth.signupTitle")}
          </CardTitle>
          <p className="text-gray-700 mx-auto text-sm">
            {t("auth.signupSubtitle")}
          </p>
          <button
            type="button"
            onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            className="absolute top-2 -right-2 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border bg-white hover:bg-accent/60 text-[10px] sm:text-xs"
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
        <CardContent className="p-0.5 sm:p-1">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="name" className="text-sm">
                {t("auth.nameLabel")}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ismingizni kiriting"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="pl-10 h-8 sm:h-9 text-sm sm:text-base bg-blue-50/60"
                />
                <User
                  className="absolute left-2 top-2 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="phone" className="text-sm">
                {t("auth.phoneLabel")}
              </Label>
              <div className="relative">
                <InputMask
                  mask="__ ___ __ __"
                  replacement={{ _: /\d/ }}
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    setError("");
                    setSuccess("");
                  }}
                  id="phone"
                  name="phone"
                  type="text"
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
                  className="pl-20 sm:pl-24 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 sm:h-9 w-full min-w-0 rounded-md border bg-blue-50/60 px-3 py-1 text-sm sm:text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 sm:file:h-7 file:border-0 file:bg-transparent file:text-xs sm:file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Phone
                  className="absolute left-2 top-2 text-gray-400"
                  size={16}
                />
                <p className="absolute left-8 sm:left-10 top-1.5 font-normal text-sm">
                  +998
                </p>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="password" className="text-sm">
                {t("auth.passwordLabel")}
              </Label>
              <div className="relative">
                <Input
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Parol"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="pl-10 h-8 sm:h-9 text-sm sm:text-base bg-blue-50/60"
                />
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
                <Lock
                  className="absolute left-2 top-2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
              <Label htmlFor="password_confirmation" className="text-sm">
                {lang === "ru" ? "Подтвердите пароль" : "Parolni tekshirish"}
              </Label>
              <div className="relative">
                <Input
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Parolni tekshirish"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  className="pl-10 h-8 sm:h-9 text-sm sm:text-base bg-blue-50/60"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="sm:w-4 sm:h-4" />
                  ) : (
                    <Eye size={16} className="sm:w-4 sm:h-4" />
                  )}
                </button>
                <Lock
                  className="absolute left-2 top-2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-xs sm:text-sm">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-xs sm:text-sm">{success}</div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground h-8 sm:h-9 text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  {t("auth.signupProgress")}
                </span>
              ) : (
                t("auth.signupBtn")
              )}
            </Button>
            <div className="flex justify-center items-center text-xs sm:text-sm">
              <p className="text-center">
                {t("auth.haveAccount")}{" "}
                <Link className="underline" to="/login">
                  {t("auth.goLogin")}
                </Link>
              </p>
            </div>
          </form>
          <Dialog open={modal} onOpenChange={setModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("auth.verifyTitle")}</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <form onSubmit={handleVerify}>
                <div className="flex flex-col gap-2 mb-2">
                  <Label htmlFor="verifyText">{t("auth.code")}</Label>
                  <Input
                    type="text"
                    id="verifyText"
                    name="verifyText"
                    placeholder="Введите код из SMS"
                  />
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
                      t("auth.send")
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      {/* floating support button (fixed chat-style) */}
      <button
        type="button"
        onClick={() => setSupportOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:brightness-110 shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
        aria-label={t("profilePanel.support")}
      >
        <Headphones className="w-6 h-6" />
      </button>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSupportOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg w-full max-w-[280px] p-4 text-center">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("support.title")}</h3>
              <p className="text-xs text-gray-600 mb-3">{t("support.description")}</p>
              <a href="https://t.me/Khamroyev_3" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:brightness-110 transition-colors text-xs font-medium">
                <svg viewBox="0 0 24 24" className="w-3 h-3" aria-hidden="true"><path fill="currentColor" d="M9.04 15.49 8.88 19c.27 0 .39-.12.54-.27l1.93-2.33 3.99 2.91c.73.4 1.26.19 1.45-.68l2.63-12.36c.27-1.25-.45-1.74-1.25-1.43L3.34 9.5c-1.2.47-1.19 1.14-.21 1.45l4.63 1.44 10.77-6.8c.51-.31.98-.14.59.2z"/></svg>
                {t("support.button")}
              </a>
              <button onClick={() => setSupportOpen(false)} className="mt-4 text-xs text-destructive hover:brightness-110">{t("support.close")}</button>
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
            className="inline-flex items-center gap-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-lg hover:brightness-110 transition-colors text-xs font-medium"
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

export default Register;
