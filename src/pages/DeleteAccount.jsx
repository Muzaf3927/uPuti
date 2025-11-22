import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// redux toolkit
import { useDispatch } from "react-redux";

// others
import { InputMask } from "@react-input/mask";
import { useSendDeleteOtp, useVerifyDeleteOtp } from "@/api/api";
import { toast } from "sonner";
import { useI18n } from "@/app/i18n.jsx";

function DeleteAccount() {
  const { t, lang, setLang } = useI18n();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendOtpMutation = useSendDeleteOtp();
  const verifyOtpMutation = useVerifyDeleteOtp();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.target);
    const phone = formData.get("phone");

    if (!phone) {
      const errorMessage = lang === "ru"
        ? "Пожалуйста, введите номер телефона"
        : "Iltimos, telefon raqamingizni kiriting";
      setFormError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Clean phone number - remove all non-digits, then extract only 9 digits (without 998)
    const cleanPhone = phone.replace(/\D/g, ""); // Remove all non-digits
    // Remove 998 prefix if present, keep only 9 digits
    const phoneWithoutPrefix = cleanPhone.startsWith("998")
      ? cleanPhone.slice(3)
      : cleanPhone;

    if (phoneWithoutPrefix.length !== 9) {
      const errorMessage = lang === "ru"
        ? "Номер телефона должен содержать 9 цифр"
        : "Telefon raqami 9 raqamdan iborat bo'lishi kerak";
      setFormError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await sendOtpMutation.mutateAsync(phoneWithoutPrefix);
      
      // Если тестовый пользователь - сразу удаляем
      if (res.message === "Account deleted successfully") {
        toast.success(t("auth.deleteAccount.successMessage"));
        try {
          sessionStorage.setItem("accountDeleted", "1");
        } catch (_) {}
        navigate("/login", { state: { accountDeleted: true } });
        return;
      }
      
      if (res.verification_id) {
        setVerificationId(res.verification_id);
        setShowOtpModal(true);
        setOtpCode("");
        setOtpError("");
        toast.success(
          lang === "ru"
            ? "Код отправлен на ваш номер телефона"
            : "Kodingiz telefon raqamingizga yuborildi"
        );
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      
      let errorMessage = "";
      
      if (err.response?.status === 404) {
        errorMessage = lang === "ru"
          ? "Пользователь не найден"
          : "Foydalanuvchi topilmadi";
      } else if (err.response?.status === 422) {
        errorMessage = err.response?.data?.message || (lang === "ru"
          ? "Проверьте правильность введенных данных"
          : "Kiritilgan ma'lumotlarni tekshiring");
      } else if (err.response?.status === 500) {
        errorMessage = err.response?.data?.message || (lang === "ru"
          ? "Ошибка отправки SMS. Попробуйте ещё раз"
          : "SMS yuborishda xatolik. Qaytadan urinib ko'ring");
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = lang === "ru"
          ? "Ошибка. Попробуйте ещё раз"
          : "Xatolik. Qaytadan urinib ko'ring";
      }
      
      toast.error(errorMessage);
      setFormError(errorMessage);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (!otpCode || otpCode.length !== 6) {
      const errorMessage = lang === "ru"
        ? "Введите 6-значный код"
        : "6 raqamli kodni kiriting";
      setOtpError(errorMessage);
      return;
    }

    if (!verificationId) {
      setOtpError(lang === "ru" ? "Ошибка верификации" : "Tekshirish xatosi");
      return;
    }

    try {
      const requestData = {
        verification_id: verificationId,
        code: otpCode,
      };

      await verifyOtpMutation.mutateAsync(requestData);
      
      toast.success(t("auth.deleteAccount.successMessage"));
      try {
        sessionStorage.setItem("accountDeleted", "1");
      } catch (_) {}
      navigate("/login", { state: { accountDeleted: true } });
    } catch (err) {
      console.error("Verify OTP error:", err);
      
      let errorMessage = "";
      
      if (err.response?.status === 422) {
        const backendMessage = err.response?.data?.message;
        if (backendMessage === "Invalid code" || backendMessage === "Verification expired") {
          errorMessage = backendMessage === "Invalid code"
            ? (lang === "ru" ? "Неверный код" : "Noto'g'ri kod")
            : (lang === "ru" ? "Код истёк. Запросите новый" : "Kod muddati tugadi. Yangi kod so'rang");
        } else if (backendMessage === "Too many attempts") {
          errorMessage = lang === "ru"
            ? "Слишком много попыток. Запросите новый код"
            : "Juda ko'p urinishlar. Yangi kod so'rang";
        } else {
          errorMessage = backendMessage || (lang === "ru"
            ? "Ошибка верификации"
            : "Tekshirish xatosi");
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = lang === "ru"
          ? "Ошибка верификации. Попробуйте ещё раз"
          : "Tekshirish xatosi. Qaytadan urinib ko'ring";
      }
      
      toast.error(errorMessage);
      setOtpError(errorMessage);
    }
  };

  return (
    <div className="pt-2 pb-6 px-1 flex gap-3 flex-col items-center justify-center min-h-screen">
      {/* Header with back button */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">{lang === "uz" ? "Orqaga" : "Назад"}</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        <Card className="w-full px-4 border rounded-2xl ring-1 ring-blue-200/60 shadow-[0_8px_24px_rgba(59,130,246,0.12)]" style={{ backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(79,70,229,0.1))" }}>
          <CardHeader className="relative p-0.5 sm:p-1">
            <CardTitle className="text-red-700 mx-auto text-lg sm:text-xl font-bold">
              {t("auth.deleteAccount.title")}
            </CardTitle>
            <p className="text-gray-500 mx-auto text-sm">
              {t("auth.deleteAccount.subtitle")}
            </p>
            <button
              type="button"
              onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border bg-white hover:bg-red-50 text-[10px] sm:text-xs"
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
            <form onSubmit={handleSendOtp} className="space-y-3 sm:space-y-4">
              {/* Warning message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700 font-medium">
                  {t("auth.deleteAccount.warning")}
                </p>
              </div>

              <div className="grid w-full max-w-sm items-center gap-2 sm:gap-3">
                <Label htmlFor="phone" className="text-sm">
                  {t("auth.deleteAccount.phoneLabel")}
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
                    placeholder={t("auth.deleteAccount.phonePlaceholder")}
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
                  <p className="absolute left-8 sm:left-10 top-1.5 font-normal select-none text-sm">
                    +998
                  </p>
                </div>
              </div>

              {formError && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="flex-1"
                  disabled={sendOtpMutation.isPending}
                >
                  {t("auth.deleteAccount.confirmCancel")}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={sendOtpMutation.isPending}
                  className="flex-1"
                >
                  {sendOtpMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      {lang === "ru" ? "Отправка..." : "Yuborilmoqda..."}
                    </span>
                  ) : (
                    lang === "ru" ? "Отправить код" : "Kod yuborish"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent preventOutsideClose={true}>
          <DialogHeader>
            <DialogTitle>
              {lang === "ru" ? "Подтверждение удаления" : "O'chirishni tasdiqlash"}
            </DialogTitle>
            <DialogDescription>
              {lang === "ru"
                ? "Введите 6-значный код, отправленный на ваш номер телефона"
                : "Telefon raqamingizga yuborilgan 6 raqamli kodni kiriting"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="otpCode">
                {lang === "ru" ? "Код подтверждения" : "Tasdiqlash kodi"}
              </Label>
              <InputMask
                mask="______"
                replacement={{ _: /\d/ }}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError("");
                }}
                id="otpCode"
                name="otpCode"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                required
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest h-12 text-lg bg-blue-50/60"
              />
            </div>
            {otpError && (
              <div className="text-red-500 text-xs sm:text-sm">
                {otpError}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOtpModal(false)}
                className="flex-1"
                disabled={verifyOtpMutation.isPending}
              >
                {t("auth.deleteAccount.confirmCancel")}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={verifyOtpMutation.isPending}
                className="flex-1"
              >
                {verifyOtpMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    {t("auth.deleteAccount.deleting")}
                  </span>
                ) : (
                  t("auth.deleteAccount.confirmDelete")
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleteAccount;
