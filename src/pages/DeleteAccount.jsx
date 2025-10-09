import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, EyeOff, Eye, ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

// redux toolkit
import { useDispatch } from "react-redux";

// others
import { InputMask } from "@react-input/mask";
import { useDeleteAccountByCredentials } from "@/api/api";
import { toast } from "sonner";
import { useI18n } from "@/app/i18n.jsx";

function DeleteAccount() {
  const { t, lang, setLang } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteAccountMutation = useDeleteAccountByCredentials();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const phone = formData.get("phone");
    const password = formData.get("password");

    // Clean phone number - remove formatting and add +998 prefix
    const cleanPhone = phone.replace(/\D/g, ""); // Remove all non-digits
    const formattedPhone = cleanPhone.startsWith("998")
      ? cleanPhone
      : `${cleanPhone}`;

    try {
      const requestData = {
        phone: formattedPhone,
        password,
      };

      await deleteAccountMutation.mutateAsync(requestData);
      toast.success(t("auth.deleteAccount.successMessage"));
      try {
        sessionStorage.setItem("accountDeleted", "1");
      } catch (_) {}
      navigate("/login", { state: { accountDeleted: true } });
    } catch (err) {
      toast.error(t("auth.deleteAccount.errorMessage"));
    }
  };

  return (
    <div className="pt-2 pb-6 px-1 flex gap-3 flex-col items-center justify-center min-h-screen bg-gray-100">
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
        <Card className="w-full px-4">
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
            <form onSubmit={handleDeleteAccount} className="space-y-3 sm:space-y-4">
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
                    mask="_________"
                    replacement={{ _: /\d/ }}
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder={t("auth.deleteAccount.phonePlaceholder")}
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
                <Label htmlFor="password" className="text-sm">
                  {t("auth.deleteAccount.passwordLabel")}
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
                    placeholder={t("auth.deleteAccount.passwordPlaceholder")}
                    required
                    className="pl-10 h-8 sm:h-9 text-sm sm:text-base"
                  />
                </div>
              </div>

              {deleteAccountMutation.error && (
                <div className="text-red-500 text-xs sm:text-sm">
                  {deleteAccountMutation.error.message ||
                    t("auth.deleteAccount.errorMessage")}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="flex-1"
                  disabled={deleteAccountMutation.isPending}
                >
                  {t("auth.deleteAccount.confirmCancel")}
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteAccountMutation.isPending}
                  className="flex-1"
                >
                  {deleteAccountMutation.isPending
                    ? t("auth.deleteAccount.deleting")
                    : t("auth.deleteAccount.confirmDelete")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DeleteAccount;
