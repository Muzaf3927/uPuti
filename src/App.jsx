import React, { useEffect, Suspense, lazy } from "react";
import { safeLocalStorage } from "@/lib/localStorage";
import { sessionManager } from "@/lib/sessionManager";
import MainLayout from "./layout/MainLayout";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./app/userSlice/userSlice";

// Lazy load page components for code splitting
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Trips = lazy(() => import("./pages/Trips"));
const Requests = lazy(() => import("./pages/Requests"));
const Chats = lazy(() => import("./pages/Chats"));
const Booking = lazy(() => import("./pages/Booking"));
const History = lazy(() => import("./pages/History"));
const FogotPassword = lazy(() => import("./pages/FogotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const DownloadAndroid = lazy(() => import("./pages/DownloadAndroid"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

function App() {
  const { user, isAuth } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const ErrorElement = () => (
    <div style={{ padding: 16 }}>
      <h2>Unexpected error</h2>
      <p>Something went wrong. Please try again.</p>
    </div>
  );

  const LoadingFallback = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <div>Loading...</div>
    </div>
  );

  const LazyWrapper = ({ children }) => (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );

  const routes = createBrowserRouter([
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : (
        <LazyWrapper>
          <Login />
        </LazyWrapper>
      ),
      errorElement: <ErrorElement />,
    },
    {
      path: "/fogotPassword",
      element: user ? <Navigate to="/" /> : (
        <LazyWrapper>
          <FogotPassword />
        </LazyWrapper>
      ),
      errorElement: <ErrorElement />,
    },
    {
      path: "/register",
      element: user ? <Navigate to="/" /> : (
        <LazyWrapper>
          <Register />
        </LazyWrapper>
      ),
      errorElement: <ErrorElement />,
    },
    {
      path: "/download/android",
      element: (
        <LazyWrapper>
          <DownloadAndroid />
        </LazyWrapper>
      ),
      errorElement: <ErrorElement />,
    },
    {
      path: "/delete",
      element: (
        <LazyWrapper>
          <DeleteAccount />
        </LazyWrapper>
      ),
      errorElement: <ErrorElement />,
    },
    {
      path: "/",
      element: user ? <MainLayout /> : <Navigate to="/register" />,
      errorElement: <ErrorElement />,
      children: [
        {
          index: true,
          element: (
            <LazyWrapper>
              <Trips />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/requests",
          element: (
            <LazyWrapper>
              <Requests />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/booking",
          element: (
            <LazyWrapper>
              <Booking />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/history",
          element: (
            <LazyWrapper>
              <History />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/chats",
          element: (
            <LazyWrapper>
              <Chats />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/profile",
          element: (
            <LazyWrapper>
              <Profile />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
        },
        {
          path: "/user/:id",
          element: (
            <LazyWrapper>
              <UserProfile />
            </LazyWrapper>
          ),
          errorElement: <ErrorElement />,
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
