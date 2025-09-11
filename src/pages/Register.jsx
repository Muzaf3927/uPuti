import React, { useState } from "react";
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
  Loader2,
  Eye,
  EyeOff,
  Car,
  Users,
  MapPin,
  User,
  Phone,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

import { InputMask } from "@react-input/mask";

function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.phone || !form.password || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSuccess("Registration successful!");
      setForm({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch {
      setError("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex gap-5 flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="flex items-center gap-5 text-green-700 font-bold text-4xl">
        <span className="rounded-full inline-block text-white bg-green-700 w-18 h-18 py-2.5">
          <Car className="mx-auto size-12" />
        </span>
        RideShare{" "}
      </h1>
      <p>Find travel companions for comfortable trips</p>
      <div className="flex gap-2 w-[450px] py-1">
        <Card className="w-full py-2 h-[80px]">
          <CardHeader>
            <CardTitle className="text-green-700 text-sm text-center flex flex-col items-center gap-1">
              <Users />
              <p>Reliable travel companions</p>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full h-[80px] py-2">
          <CardHeader>
            <CardTitle className="text-green-700 text-center flex flex-col items-center gap-1">
              <MapPin />
              <p>Convenient routes</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-700 mx-auto text-xl font-bold">
            Ro'yhatdan o'tish
          </CardTitle>
          <p className="text-gray-500 mx-auto">Hisob yaratish</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="name">Ism</Label>
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
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
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
              <Label htmlFor="confirmPassword">Parolni tekshirish</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Parolni tekshirish"
                  value={form.confirmPassword}
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
                  Ro'yhatdan o'tilmoqda...
                </span>
              ) : (
                "Ro'yhatdan o'tish"
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
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
