import React, { useState } from "react";
import { useGetData, usePostData } from "@/api/api";

// shad ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2Icon, CircleX, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useDispatch } from "react-redux";
import { logout } from "@/app/userSlice/userSlice";

function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const { data, isLoading, error, refetch } = useGetData("/user");

  const dispatch = useDispatch();

  console.log(data && data);

  const logoutMutation = usePostData("/logout");

  const handleLogout = async () => {
    try {
      const res = await logoutMutation.mutateAsync();

      dispatch(logout());

      localStorage.setItem("token", "");
      toast.success("Muvaffaqiyatli tizimdan chiqdingiz!");
    } catch {
      console.log("Logged out.");
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center w-full py-10">
        <Tabs
          defaultValue="userInfo"
          className="w-full flex flex-col sm:flex-row items-center"
        >
          <TabsList className="sm:h-[300px] h-full flex items-start">
            <div className="flex flex-row sm:flex-col gap-3 justify-start text-left items-start p-4">
              <img
                className="size-20 rounded-full mb-3"
                src={
                  (data && data?.avatar) ||
                  `https://api.dicebear.com/9.x/initials/svg?seed=${data?.name}`
                }
                alt="avatar"
              />
              <div className="flex flex-col items-start">
                <TabsTrigger value="userInfo">Hisobim</TabsTrigger>
                <TabsTrigger value="changePassword">
                  Parolni o'zgartirish
                </TabsTrigger>
                <TabsTrigger onClick={handleLogout}>
                  Tizimdan chiqish <LogOut />
                </TabsTrigger>
              </div>
            </div>
          </TabsList>
          <TabsContent value="userInfo">
            <Card>
              <CardContent className="flex flex-col gap-3">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="name">Ism familiyangiz</Label>
                  <Input
                    type="name"
                    id="name"
                    defaultValue={data.name}
                    placeholder="Ism familiya"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="number">Telefon raqamingiz</Label>
                  <Input
                    type="text"
                    id="number"
                    defaultValue={data.phone}
                    placeholder="90 123 45 67"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="text">Telegramingiz</Label>
                  <Input
                    type="text"
                    id="text"
                    defaultValue={data.telegram_chat_id || "Bo'sh"}
                    placeholder="@usename"
                  />
                </div>
                {data.is_verified ? (
                  <div className="p-2 rounded-2xl bg-green-600 text-white">
                    Tasdiqlangan <CheckCircle2Icon />
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <Button className="flex gap-2 w-40 p-2 bg-red-600 text-white">
                      Tasdiqlanmagan <CircleX />
                    </Button>
                    <Button className="bg-green-400">Tasdiqlash</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="changePassword">
            <Card>
              <CardContent className="flex flex-col gap-3">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="password">Parolingiz</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="newPassword">Yangi parolingiz</Label>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="passwordConfirm">
                    Yangi parolingizni tasdiqlang
                  </Label>
                  <Input
                    type={showNewPasswordConfirm ? "text" : "password"}
                    id="passwordConfirm"
                    name="passwordConfirm"
                  />
                </div>
                <div className="flex gap-3">
                  <Button>Formani yangilash</Button>
                  <Button>Tasdiqlash</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div></div>
      </div>
      <div></div>
    </div>
  );
}

export default Profile;
