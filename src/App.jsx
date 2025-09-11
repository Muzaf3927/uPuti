import React, { useEffect } from "react";
import {
  Login,
  Register,
  Trips,
  Requests,
  Chats,
  Booking,
  History,
} from "./pages";
import MainLayout from "./layout/MainLayout";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./app/userSlice/userSlice";

/*  Запросы Брони История
Поездки
Чаты

Мои запросы
На мои поездки

Requests;
*/

function App() {
  const { user, isAuth } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const routes = createBrowserRouter([
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
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
      ],
    },
  ]);

  const isUser = localStorage.getItem("user");

  if (isUser) {
    dispatch(login(isUser));
  }

  return <RouterProvider router={routes} />;
}

export default App;
