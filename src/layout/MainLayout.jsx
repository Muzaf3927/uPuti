import React from "react";
import Navbar from "@/components/Navbar";
import { Bell, Car, CircleUser, LogOut, Phone } from "lucide-react";
import { useI18n } from "@/app/i18n.jsx";
import { useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { logout } from "@/app/userSlice/userSlice";

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// others
import { usePostData, useGetData } from "@/api/api";

// get firstName
function getNthWord(str, n) {
  const parts = str.trim().split(/\s+/);
  return n >= 1 && n <= parts.length ? parts[n - 1] : null;
}

function MainLayout() {
  const dispatch = useDispatch();
  const { lang, setLang, t } = useI18n();
  const [profileOpen, setProfileOpen] = React.useState(false);

  const logoutMutation = usePostData("/logout");
  const { data, isLoading, error, refetch } = useGetData("/notifications");
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch: userRefetch,
  } = useGetData("/user");

  const handleLogout = async () => {
    try {
      const res = await logoutMutation.mutateAsync();

      dispatch(logout());

      localStorage.setItem("token", "");
      toast.success("Muvaffaqiyatli tizimdan chiqdingiz!");
    } catch {
      // silently ignore
    }
  };
  return (
    <div className="flex flex-col h-full ">
      <header className="h-20 sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b">
        <div className="flex justify-between items-center py-3 custom-container overflow-hidden">
          <div className="flex gap-3 items-center">
            <Link className="rounded-2xl p-0" to="/">
              <img src="/logo.png" alt="UPuti" className="h-12 sm:h-14 w-auto object-contain mix-blend-multiply" />
            </Link>
            <div>
              <h4 className="text-2xl font-bold text-green-700">UPuti</h4>
              <p className="text-sm text-gray-600">Salom, {userData && userData.name}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
              className="px-3 py-1 rounded-full border bg-white/80 hover:bg-green-50 text-sm"
              title={lang === "uz" ? "RU" : "UZ"}
            >
              {lang === "uz" ? "🇷🇺 RU" : "🇺🇿 UZ"}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Bell className="cursor-pointer text-gray-700 hover:text-green-600 transition" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {data && data.notifications.map(() => <div>Bildirishnoma</div>)}
                {data && data.notifications.length == 0 && (
                  <DropdownMenuLabel className="w-20 sm:w-[180px] text-center">
                    Bu yerda sizga kelgan bildirishnomalar ko'rinadi.
                  </DropdownMenuLabel>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <button type="button" onClick={() => { setProfileOpen(true); userRefetch(); }}>
              <CircleUser className="cursor-pointer text-gray-700 hover:text-green-600 transition" />
            </button>
          </div>
        </div>
      </header>
      <div className="custom-container my-5">
        <Navbar />
      </div>
      <main className="grow custom-container mb-10">
        <Outlet />
      </main>
      {/* Right Panel Profile */}
      {profileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setProfileOpen(false)} />
          <div className="absolute right-2 top-2 h-[400px] w-[250px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {(userData?.name || "U").slice(0,1)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{userData?.name}</span>
                  <span className="text-xs text-gray-500">{userData?.phone}</span>
                </div>
              </div>
              <button onClick={() => setProfileOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="border rounded-2xl p-4 mb-3 bg-white/70">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">{t("profilePanel.name")}</span>
                  <span className="font-medium">{userData?.name}</span>
                  <span className="text-gray-500">{t("profilePanel.phone")}</span>
                  <span className="font-medium">{userData?.phone}</span>
                  {userData?.rating !== undefined && (
                    <>
                      <span className="text-gray-500">{t("profilePanel.rating")}</span>
                      <span className="font-medium">⭐ {userData?.rating} ({userData?.rating_count || 0})</span>
                    </>
                  )}
                  {userData?.balance !== undefined && (
                    <>
                      <span className="text-gray-500">{t("profilePanel.balance")}</span>
                      <span className="font-medium">{Number(userData.balance).toLocaleString()} UZS</span>
                    </>
                  )}
                </div>
              </div>
              <div className="border rounded-2xl p-4 bg-white/70">
                <div className="text-sm text-gray-600 mb-1">{t("profilePanel.support")}</div>
                <div className="flex items-center gap-2">
                  <Phone className="text-green-600" />
                  <a href="tel:+998900038902" className="text-green-700 font-semibold text-xs truncate max-w-[230px]">+998 90 003 89 02</a>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button onClick={handleLogout} className="w-full bg-red-600 text-white rounded-2xl py-2 flex items-center justify-center gap-2">
                <LogOut /> {t("profilePanel.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
