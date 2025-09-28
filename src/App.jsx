import React, { useEffect } from "react";
import { safeLocalStorage } from "@/lib/localStorage";
import { sessionManager } from "@/lib/sessionManager";
import {
  Login,
  Register,
  Trips,
  Requests,
  Chats,
  Booking,
  History,
  FogotPassword,
  Profile,
} from "./pages";
import MainLayout from "./layout/MainLayout";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./app/userSlice/userSlice";
import UserProfile from "./pages/UserProfile";

function App() {
  const { user, isAuth } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const routes = createBrowserRouter([
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/fogotPassword",
      element: user ? <Navigate to="/" /> : <FogotPassword />,
    },
    {
      path: "/register",
      element: user ? <Navigate to="/" /> : <Register />,
    },
    {
      path: "/",
      element: user ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        {
          index: true,
          element: <Trips />,
        },
        {
          path: "/requests",
          element: <Requests />,
        },
        {
          path: "/booking",
          element: <Booking />,
        },
        {
          path: "/history",
          element: <History />,
        },
        {
          path: "/chats",
          element: <Chats />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },

        {
          path: "/user/:id",
          element: <UserProfile />,
        },
      ],
    },
  ]);

  useEffect(() => {
    // Проверяем, есть ли активная и валидная сессия
    if (sessionManager.hasActiveSession() && !sessionManager.isSessionExpired()) {
      const userData = sessionManager.getUserData();
      if (userData) {
        dispatch(login(userData));
      } else {
        // Очищаем невалидные данные
        sessionManager.clearSession();
      }
    } else {
      // Если сессия истекла или невалидна, очищаем её
      sessionManager.clearSession();
    }
  }, []);

  return <RouterProvider router={routes} />;
}

export default App;
