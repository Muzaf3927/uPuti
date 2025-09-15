import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { VITE_API_BASE } = import.meta.env;

const api = axios.create({
  baseURL: VITE_API_BASE || "https://blablajava.vercel.app/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const refreshAccessToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem("reFreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const { data } = await axios.post(
      `${
        VITE_API_BASE || "https://blablajava.vercel.app/api/proxy"
      }/refresh-token`,
      {
        refresh_token: refreshToken,
      }
    );

    sessionStorage.setItem("token", data.access_token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.access_token}`;
  } catch (error) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("reFreshToken");
    window.location.href = "/signin";
  }
};

// Set up automatic refresh every 3 hours
setInterval(refreshAccessToken, 3 * 60 * 60 * 1000); // 3 hours

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", error);

    // Handle CORS and network errors
    if (!error.response) {
      console.error("Network error or CORS issue:", error.message);
      return Promise.reject(
        new Error(
          "Network error. Please check your connection or try again later."
        )
      );
    }

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessToken();
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export const getData = async (url) => {
  const { data } = await api.get(url);
  return data;
};

export const postData = async (url, body) => {
  try {
    const { data } = await api.post(url, body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (url) => {
  const { data } = await api.delete(url);
  return data;
};

// Example usage with TanStack Query
export const useGetData = (url) => {
  return useQuery({ queryKey: ["data", url], queryFn: () => getData(url) });
};

export const usePostData = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => postData(url, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data", url] });
    },
  });
};

export const useDeleteData = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteData(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data", url] });
    },
  });
};

// HOW TO USE EXAMPLES:

// 1. GET DATA (useGetData hook)
// const { data, isLoading, error, refetch } = useGetData("/trips");
// if (isLoading) return <div>Loading...</div>;
// if (error) return <div>Error: {error.message}</div>;
// return <div>{data?.map(trip => <div key={trip.id}>{trip.from} to {trip.to}</div>)}</div>;

// 2. POST DATA (usePostData hook)
// const createTrip = usePostData("/trips");
// const handleSubmit = async (formData) => {
//   try {
//     const result = await createTrip.mutateAsync(formData);
//     console.log("Trip created:", result);
//   } catch (error) {
//     console.error("Failed to create trip:", error);
//   }
// };
// <button onClick={() => handleSubmit({from: "Tashkent", to: "Samarkand"})} disabled={createTrip.isPending}>
//   {createTrip.isPending ? "Creating..." : "Create Trip"}
// </button>

// 3. DELETE DATA (useDeleteData hook)
// const deleteTrip = useDeleteData("/trips");
// const handleDelete = async (tripId) => {
//   try {
//     await deleteTrip.mutateAsync();
//     console.log("Trip deleted successfully");
//   } catch (error) {
//     console.error("Failed to delete trip:", error);
//   }
// };
// <button onClick={() => handleDelete(123)} disabled={deleteTrip.isPending}>
//   {deleteTrip.isPending ? "Deleting..." : "Delete Trip"}
// </button>

// 4. LOGIN EXAMPLE (using usePostData)
// const loginMutation = usePostData("/login");
// const handleLogin = async (credentials) => {
//   try {
//     const response = await loginMutation.mutateAsync(credentials);
//     localStorage.setItem("token", response.access_token);
//     localStorage.setItem("user", JSON.stringify(response.user));
//   } catch (error) {
//     console.error("Login failed:", error);
//   }
// };
// <form onSubmit={(e) => { e.preventDefault(); handleLogin({phone: "998901234567", password: "123456"}); }}>
//   {loginMutation.error && <div>Login failed: {loginMutation.error.message}</div>}
//   <button type="submit" disabled={loginMutation.isPending}>
//     {loginMutation.isPending ? "Logging in..." : "Login"}
//   </button>
// </form>

// 5. FETCH USER PROFILE (using useGetData)
// const { data: user, isLoading: userLoading, error: userError } = useGetData("/user/profile");
// if (userLoading) return <div>Loading profile...</div>;
// if (userError) return <div>Error loading profile</div>;
// return <div>Welcome, {user?.name}!</div>;

// 6. UPDATE TRIP STATUS (using usePostData)
// const updateTripStatus = usePostData("/trips/update-status");
// const handleStatusUpdate = async (tripId, newStatus) => {
//   try {
//     await updateTripStatus.mutateAsync({ tripId, status: newStatus });
//     console.log("Status updated successfully");
//   } catch (error) {
//     console.error("Failed to update status:", error);
//   }
// };
// <button onClick={() => handleStatusUpdate(123, "completed")} disabled={updateTripStatus.isPending}>
//   Mark as Completed
// </button>
