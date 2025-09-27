import { Bookmark, History, Inbox, MessageCircle, Route } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/app/i18n.jsx";
import { useBookingsUnreadCount, useGetUnreadCount } from "@/api/api";

function Navbar() {
  const location = useLocation();
  const { t } = useI18n();
  const { data: unreadCounts } = useBookingsUnreadCount();
  const { data: chatUnread } = useGetUnreadCount();
  
  const links = [
    { 
      path: "/requests", 
      name: t("nav.requests"), 
      icon: <Inbox size={20} />,
      unreadCount: (unreadCounts?.my_pending_unread || 0) + (unreadCounts?.to_my_trips_pending_unread || 0)
    },
    { 
      path: "/booking", 
      name: t("nav.booking"), 
      icon: <Bookmark size={20} />,
      unreadCount: (unreadCounts?.my_confirmed_unread || 0) + (unreadCounts?.to_my_trips_confirmed_unread || 0)
    },
    { path: "/history", name: t("nav.history"), icon: <History size={20} /> },
    { path: "/", name: t("nav.trips"), icon: <Route size={20} /> },
    { 
      path: "/chats", 
      name: t("nav.chats"), 
      icon: <MessageCircle size={20} />,
      unreadCount: chatUnread?.unread_count || 0
    },
  ];
  return (
    <div className="flex justify-between p-2 rounded-3xl bg-white/70 backdrop-blur-sm border shadow-sm">
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive ? "bg-green-500 text-white shadow" : "bg-white text-gray-700"
            } text-center flex justify-center items-center flex-col w-[68px] sm:w-[88px] text-sm h-[58px] sm:h-[72px] border-2 border-green-200 rounded-2xl transition-all duration-300 hover:bg-green-100 hover:shadow-[0px_5px_15px_rgba(134,239,172,0.35)] relative`}
          >
            <div className="relative">
              {link.icon}
              {link.unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {link.unreadCount > 9 ? '9+' : link.unreadCount}
                </span>
              )}
            </div>
            <span className="text-sm hidden ss:block">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default Navbar;
