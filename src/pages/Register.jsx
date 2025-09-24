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
import { InputMask } from "@react-input/mask";
import { usePostData } from "@/api/api";
import { toast } from "sonner";
import { useI18n } from "@/app/i18n.jsx";

function Register() {
  const { t, lang, setLang } = useI18n();
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
      setError("Iltimos hammasini to'ldiring.");
      return;
    }
    if (password !== password_confirmation) {
      setError("Parol mos emas!");
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
    const formData = new FormData(e.target);

    const verifyText = formData.get("verifyText");

    //

    const resultData = {
      verification_id: registerDataRef.current?.verification_id,
      message: verifyText,
    };

    try {
      const res = await verifyMuatation.mutateAsync(resultData);

      dispatch(login(res));
      localStorage.setItem("token", res?.access_token);
      toast.success("Muvaffaqiyatli royhatdan o'tdingiz!");

      setSuccess("Registration successful!");
    } catch (err) {
      //
      setError("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-2 flex gap-5 flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="flex items-center justify-center text-green-700 font-bold">
        <img src="/logo.png" alt="UPuti" className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply" />
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
          <CardTitle className="text-green-700 mx-auto text-md sm:text-xl font-bold">
            {t("auth.signupTitle")}
          </CardTitle>
          <p className="text-gray-500 mx-auto text-sm sm:text-md">
            {t("auth.signupSubtitle")}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="name">{t("auth.nameLabel")}</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ismingizni kiriting"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
                <User
                  className="absolute left-2 top-2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="phone">{t("auth.phoneLabel")}</Label>
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
                  type="text"
                  inputMode="numeric"
                  placeholder={t("auth.phonePlaceholder")}
                  required
                  autoComplete="tel"
                  className="pl-20 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <Phone
                  className="absolute left-2 top-2 text-gray-400"
                  size={20}
                />
                <p className="absolute left-10 top-1.5 font-normal">+998</p>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">{t("auth.passwordLabel")}</Label>
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
              <Label htmlFor="password_confirmation">{lang === "ru" ? "Подтвердите пароль" : "Parolni tekshirish"}</Label>
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  {t("auth.signupProgress")}
                </span>
              ) : (
                t("auth.signupBtn")
              )}
            </Button>
            <div className="flex justify-center items-center text-sm">
              <p>
                {t("auth.haveAccount")} {" "}
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
                    placeholder="*********"
                  />
                </div>
                <div>
                  <Button>{t("auth.send")}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
