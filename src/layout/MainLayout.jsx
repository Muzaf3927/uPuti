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
      console.log("Failed to connect to API.");
    }
  };
  return (
    <div className="flex flex-col h-full ">
      <header className="shadow-[0_4px_6px_-1px_rgba(34,197,94,0.1)] h-20">
        <div className="flex justify-between items-center py-3 custom-container overflow-hidden">
          <div className="flex gap-3">
            <Link className="w-15 h-15 bg-green-700 rounded-2xl p-3" to="/">
              <Car className="text-white size-8" />
            </Link>
            <div>
              <h4 className="text-2xl font-bold text-green-700">RideShare</h4>
              <p>Salom, {userData && getNthWord(userData.name, 1)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Bell className="cursor-pointer" />
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
                <CircleUser className="cursor-pointer" />
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
      <main className="grow custom-container">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
