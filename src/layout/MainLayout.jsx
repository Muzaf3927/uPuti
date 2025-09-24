import React from "react";
import Navbar from "@/components/Navbar";
import { Bell, Car, CircleUser, LogOut, UserCircle2Icon } from "lucide-react";
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

            <DropdownMenu>
              <DropdownMenuTrigger>
                <CircleUser className="cursor-pointer text-gray-700 hover:text-green-600 transition" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/profile">Profilga o'tish</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  Tizimdan chiqish
                  <LogOut className="cursor-pointer text-red-600" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="custom-container my-5">
        <Navbar />
      </div>
      <main className="grow custom-container mb-10">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
