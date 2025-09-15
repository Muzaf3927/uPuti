import React, { useState } from "react";

// shadcn ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, Users, User, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

// redux toolkit
import { useDispatch } from "react-redux";
import { login } from "@/app/userSlice/userSlice";

// others
import { Link } from "react-router-dom";
import { InputMask } from "@react-input/mask";
import { postData } from "@/api/api";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const { data } = postData("/login", {
    phone: "900038989",
    password: "900038901",
  });

  console.log(data);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const phone = formData.get("phone");
    const password = formData.get("password");

    setLoading(true);
    setError("");
    try {
      // Call login reducer and set user true

      dispatch(login(res));
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(res));
    } catch (err) {
      setError("Login failed", err);
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
      <div className="flex gap-2 w-full max-w-[450px] py-1">
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
            <CardTitle className="text-green-700 text-sm text-center flex flex-col items-center gap-1">
              <MapPin />
              <p>Convenient routes</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-700 mx-auto text-xl font-bold">
            Login
          </CardTitle>
          <p className="text-gray-500 mx-auto">Login your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </span>
                <InputMask
                  mask="(__) ___-__-__"
                  replacement={{ _: /\d/ }}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="(90) 123 45 67"
                  required
                  className="pl-20 font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <p className="absolute left-10 top-1.5 font-normal">+998</p>
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex justify-between items-center text-sm">
              <Link to="" className="underline">
                Forgot Password
              </Link>
              <p>
                Don't have an account?{" "}
                <Link className="underline" to="/register">
                  Register
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
