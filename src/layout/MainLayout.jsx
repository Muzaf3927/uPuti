import React from "react";
import Navbar from "@/components/Navbar";
import { Bell, Car, LogOut } from "lucide-react";
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

function MainLayout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.setItem("user", "");
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
              <p>Salom, [User]</p>
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Bell className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="w-20 sm:w-[180px] text-center">
                  Bu yerda sizga kelgan bildirishnomalar ko'rinadi.
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

            <LogOut onClick={handleLogout} className="cursor-pointer" />
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
