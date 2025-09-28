import React from "react";
import Navbar from "@/components/Navbar";
import { Bell, Car, CircleUser, LogOut, Phone, MessageCircle, Headphones, User } from "lucide-react";
import { useI18n } from "@/app/i18n.jsx";
import { useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { logout } from "@/app/userSlice/userSlice";
import Onboarding from "@/components/Onboarding";
import { getInitials } from "@/lib/utils";

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
import { usePostData, useGetData, useNotifications, useNotificationsUnread, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/api/api";

// get firstName
function getNthWord(str, n) {
  const parts = str.trim().split(/\s+/);
  return n >= 1 && n <= parts.length ? parts[n - 1] : null;
}

function MainLayout() {
  const dispatch = useDispatch();
  const { lang, setLang, t } = useI18n();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [supportOpen, setSupportOpen] = React.useState(false);

  // Проверяем, нужно ли показать онбординг
  React.useEffect(() => {
    const shouldShowOnboarding = localStorage.getItem("showOnboarding");
    if (shouldShowOnboarding === "true") {
      setShowOnboarding(true);
      localStorage.removeItem("showOnboarding");
    }
  }, []);

  const logoutMutation = usePostData("/logout");
  const { data: notifications } = useNotifications();
  const { data: unread } = useNotificationsUnread();
  const markAll = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();
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
      <header className="h-16 sm:h-20 sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b">
        <div className="flex justify-between items-center py-2 sm:py-3 custom-container overflow-hidden">
          <div className="flex gap-2 sm:gap-3 items-center">
            <Link className="rounded-2xl p-0" to="/">
              <img src="/logo.png" alt="UPuti" className="h-10 sm:h-12 lg:h-14 w-auto object-contain-50 hover:opacity-100 transition-opacity mix-blend-multiply" />
            </Link>
          </div>
          <div className="flex gap-1 sm:gap-2 items-center">
            <button
              type="button"
              onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
              className="px-2 py-1 sm:px-3 sm:py-1 rounded-full border bg-white/80 hover:bg-green-50 text-xs sm:text-sm"
              title={lang === "uz" ? "RU" : "UZ"}
            >
              {lang === "uz" ? "🇷🇺 RU" : "🇺🇿 UZ"}
            </button>
            <div className="flex gap-1 sm:gap-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="relative">
                  <Bell className="cursor-pointer text-gray-700 hover:text-green-600 transition w-5 h-5 sm:w-6 sm:h-6" />
                  {!!unread?.unread_count && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center">
                      {unread.unread_count}
                    </span>
                  )}
                </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 sm:w-72 max-h-96 overflow-auto">
                <div className="flex items-center justify-between px-2 py-1">
                  <DropdownMenuLabel className="text-xs sm:text-sm">Уведомления</DropdownMenuLabel>
                  <button disabled={markAll.isPending} onClick={() => markAll.mutate()} className="text-xs text-green-700 hover:underline">
                    Прочитать все
                  </button>
                </div>
                <DropdownMenuSeparator />
                {!notifications?.notifications?.filter(n => !n.is_read)?.length && (
                  <DropdownMenuLabel className="text-center text-xs py-6 text-gray-500">
                    Уведомлений нет
                  </DropdownMenuLabel>
                )}
                {notifications?.notifications?.filter(n => !n.is_read)?.map((n) => (
                  <DropdownMenuItem key={n.id} className="whitespace-normal py-1 sm:py-2">
                    <div className="flex items-start justify-between gap-1 sm:gap-2 w-full">
                      <div className="flex-1">
                        <div className={`text-xs sm:text-sm ${n.is_read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>{n.message}</div>
                        {n.created_at && (
                          <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{new Date(n.created_at).toLocaleString()}</div>
                        )}
                      </div>
                      {!n.is_read && (
                        <button onClick={(e) => { e.stopPropagation(); markRead.mutate(n.id); }} className="text-xs text-blue-600 hover:underline">
                          Прочитать
                        </button>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <button type="button" onClick={() => { setProfileOpen(true); userRefetch(); }}>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer hover:bg-green-700 transition">
                {getInitials(userData?.name)}
              </div>
            </button>
          </div>
        </div>
      </header>
      <div className="custom-container my-3 sm:my-5">
        <Navbar />
      </div>
      <main className="grow custom-container mb-6 sm:mb-10">
        <Outlet />
      </main>
      {/* Right Panel Profile */}
      {profileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setProfileOpen(false)} />
          <div className="absolute right-1 top-1 sm:right-2 sm:top-2 h-[290px] sm:h-[340px] w-[220px] sm:w-[250px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  {(userData?.name || "U").slice(0,1)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm sm:text-base">{userData?.name}</span>
                  <span className="text-xs text-gray-500">{userData?.phone}</span>
                </div>
              </div>
              <button onClick={() => setProfileOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
              <div className="border rounded-2xl p-3 sm:p-4 bg-white/70 min-w-[280px]">
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t("profilePanel.name")}:</span>
                    <span className="font-medium">{userData?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t("profilePanel.phone")}:</span>
                    <span className="font-medium">{userData?.phone ? `+998${userData.phone}` : "—"}</span>
                  </div>
                  {userData?.rating !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{t("profilePanel.rating")}:</span>
                      <span className="font-medium">⭐ {userData?.rating} ({userData?.rating_count || 0})</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="border rounded-2xl p-3 sm:p-4 bg-white/70 min-w-[280px]">
                <button
                  onClick={() => setSupportOpen(true)}
                  className="w-full flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <Headphones className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">{t("profilePanel.support")}</span>
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4 border-t">
              <button onClick={handleLogout} className="w-full bg-red-600 text-white rounded-2xl py-2 flex items-center justify-center gap-2 text-sm">
                <LogOut className="w-4 h-4" /> {t("profilePanel.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showOnboarding && (
        <Onboarding 
          onComplete={() => setShowOnboarding(false)} 
          setLang={setLang}
        />
      )}

      {/* Support Modal */}
      {supportOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSupportOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-[280px] p-4 text-center">
              <div className="mb-3">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <User className="w-10 h-10 text-green-600 absolute top-1 left-1" />
                  <Headphones className="w-6 h-6 text-green-500 absolute -top-1 -right-1" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("support.title")}</h3>
                <p className="text-xs text-gray-600 mb-3">{t("support.description")}</p>
              </div>
              <a
                href="https://t.me/Khamroev_3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
              >
                <MessageCircle className="w-3 h-3" />
                {t("support.button")}
              </a>
              <button
                onClick={() => setSupportOpen(false)}
                className="mt-8 text-xs text-red-500 hover:text-red-700"
              >
{t("support.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
