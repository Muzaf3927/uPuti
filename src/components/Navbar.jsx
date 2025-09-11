import { Bookmark, History, Inbox, MessageCircle, Route } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const links = [
    { path: "/requests", name: "Requests", icon: <Inbox size={20} /> },
    { path: "/booking", name: "Booking", icon: <Bookmark size={20} /> },
    { path: "/history", name: "History", icon: <History size={20} /> },
    { path: "/", name: "Trips", icon: <Route size={20} /> },
    { path: "/chats", name: "Chats", icon: <MessageCircle size={20} /> },
  ];
  return (
    <div className="flex justify-between">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive && "bg-green-400 text-white"
            }text-center flex justify-center items-center flex-col w-[100px] text-sm h-[70px] border-2 border-green-300 rounded-2xl transition-all duration-300 hover:bg-green-400 hover:text-white hover:shadow-[0px_5px_15px_rgba(134,239,172,0.35)]`}
          >
            {link.icon}
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}

export default Navbar;
