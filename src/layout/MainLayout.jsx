import Navbar from "@/components/Navbar";
import { Car, LogOut } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { logout } from "@/app/userSlice/userSlice";

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
          <LogOut onClick={handleLogout} className="cursor-pointer" />
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
