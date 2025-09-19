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

function FogotPassword() {
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
    const formData = new FormData(e.target);

    const verifyText = formData.get("verifyText");
    const password = formData.get("password");
    const password_confirmation = formData.get("password_confirmation");

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

    try {
      const res = await fogotPasswordMutationTwo.mutateAsync(resultData);
      console.log(res);

      toast.success("Parol muvaffaqiyatli yangilandi!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      console.log(err);
      setError("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-2 flex gap-5 flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="flex items-center gap-5 text-green-700 font-bold text-3xl sm:text-4xl">
        <span className="rounded-full inline-block text-white bg-green-700 size-15 sm:size-18 py-2">
          <Car className="mx-auto size-12" />
        </span>
        RideShare
      </h1>
      <p>Find travel companions for comfortable trips</p>
      <div className="flex gap-2 w-full max-w-[450px] py-1"></div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-700 mx-auto text-md sm:text-xl font-bold">
            Parolni yangilash
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="phone">Telefon Raqamingiz</Label>
              <div className="relative">
                <InputMask
                  mask="(__) ___-__-__"
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
                  placeholder="(90) 123 45 67"
                  required
                  className="pl-20 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <Phone
                  className="absolute left-2 top-2 text-gray-400"
                  size={20}
                />
                <p className="absolute left-10 top-1.5 font-normal">+998</p>
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
                  Parol yangilanmoqda...
                </span>
              ) : (
                "Parolni yangilash"
              )}
            </Button>
            <div className="flex justify-center items-center text-sm">
              <p>
                Allaqachon hisobingiz bormi?{" "}
                <Link className="underline" to="/login">
                  Tizimga kiring
                </Link>
              </p>
            </div>
          </form>
          <Dialog open={modal} onOpenChange={setModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Raqamingizga kelgan kodni kiriting</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleVerify} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 mb-2">
                  <Label htmlFor="verifyText">Kod</Label>
                  <Input
                    type="text"
                    id="verifyText"
                    name="verifyText"
                    placeholder="*********"
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="password">Parol</Label>
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
                  <Label htmlFor="password_confirmation">
                    Parolni tekshirish
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
                  <Button>Yuborish</Button>
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
