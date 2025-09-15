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

// 4. PURE AXIOS FUNCTIONS (getData, postData, deleteData)

// GET DATA - Fetch trips list
// const fetchTrips = async () => {
//   try {
//     const trips = await getData("/trips");
//     console.log("Trips:", trips);
//     setTrips(trips); // Update state
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//     setError("Failed to load trips");
//   }
// };

// GET DATA - Fetch single trip
// const fetchTrip = async (tripId) => {
//   try {
//     const trip = await getData(`/trips/${tripId}`);
//     console.log("Trip details:", trip);
//     setTrip(trip);
//   } catch (error) {
//     console.error("Error fetching trip:", error);
//   }
// };

// GET DATA - Fetch user profile
// const fetchUserProfile = async () => {
//   try {
//     const user = await getData("/user/profile");
//     console.log("User profile:", user);
//     setUser(user);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//   }
// };

// POST DATA - Create new trip
// const createTrip = async (tripData) => {
//   try {
//     const newTrip = await postData("/trips", {
//       from: "Tashkent",
//       to: "Samarkand",
//       date: "2024-01-15",
//       time: "09:00",
//       price: 50000,
//       seats: 3
//     });
//     console.log("Created trip:", newTrip);
//     // Refresh trips list
//     fetchTrips();
//   } catch (error) {
//     console.error("Error creating trip:", error);
//   }
// };

// POST DATA - User login
// const loginUser = async (credentials) => {
//   try {
//     const response = await postData("/auth/login", {
//       phone: "998901234567",
//       password: "123456"
//     });
//     console.log("Login successful:", response);
//     localStorage.setItem("token", response.access_token);
//     localStorage.setItem("user", JSON.stringify(response.user));
//     // Redirect to dashboard
//     window.location.href = "/";
//   } catch (error) {
//     console.error("Login failed:", error);
//     setError("Invalid credentials");
//   }
// };

// POST DATA - User registration
// const registerUser = async (userData) => {
//   try {
//     const response = await postData("/auth/register", {
//       name: "John Doe",
//       phone: "998901234567",
//       password: "123456",
//       email: "john@example.com"
//     });
//     console.log("Registration successful:", response);
//     // Auto login after registration
//     loginUser({ phone: userData.phone, password: userData.password });
//   } catch (error) {
//     console.error("Registration failed:", error);
//   }
// };

// POST DATA - Update trip status
// const updateTripStatus = async (tripId, status) => {
//   try {
//     const response = await postData(`/trips/${tripId}/status`, {
//       status: "completed" // or "cancelled", "active"
//     });
//     console.log("Status updated:", response);
//     // Refresh the trip data
//     fetchTrip(tripId);
//   } catch (error) {
//     console.error("Error updating status:", error);
//   }
// };

// POST DATA - Send message
// const sendMessage = async (tripId, message) => {
//   try {
//     const response = await postData(`/trips/${tripId}/messages`, {
//       message: "Hello, I'm interested in this trip",
//       type: "text"
//     });
//     console.log("Message sent:", response);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// DELETE DATA - Delete trip
// const removeTrip = async (tripId) => {
//   try {
//     await deleteData(`/trips/${tripId}`);
//     console.log("Trip deleted successfully");
//     // Remove from local state or refresh list
//     setTrips(trips.filter(trip => trip.id !== tripId));
//   } catch (error) {
//     console.error("Error deleting trip:", error);
//   }
// };

// DELETE DATA - Cancel booking
// const cancelBooking = async (bookingId) => {
//   try {
//     await deleteData(`/bookings/${bookingId}`);
//     console.log("Booking cancelled");
//     // Refresh bookings list
//     fetchBookings();
//   } catch (error) {
//     console.error("Error cancelling booking:", error);
//   }
// };

// DELETE DATA - Delete user account
// const deleteAccount = async () => {
//   try {
//     await deleteData("/user/account");
//     console.log("Account deleted");
//     // Clear local storage and redirect
//     localStorage.clear();
//     window.location.href = "/login";
//   } catch (error) {
//     console.error("Error deleting account:", error);
//   }
// };

// USAGE IN COMPONENT WITH LOADING STATES
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");

// const handleCreateTrip = async (formData) => {
//   setLoading(true);
//   setError("");
//   try {
//     await createTrip(formData);
//     setSuccess("Trip created successfully!");
//   } catch (err) {
//     setError("Failed to create trip");
//   } finally {
//     setLoading(false);
//   }
// };

// <button onClick={handleCreateTrip} disabled={loading}>
//   {loading ? "Creating..." : "Create Trip"}
// </button>
// {error && <div className="error">{error}</div>}

// 5. LOGIN EXAMPLE (using usePostData)
// const loginMutation = usePostData("/auth/login");
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

// 6. FETCH USER PROFILE (using useGetData)
// const { data: user, isLoading: userLoading, error: userError } = useGetData("/user/profile");
// if (userLoading) return <div>Loading profile...</div>;
// if (userError) return <div>Error loading profile</div>;
// return <div>Welcome, {user?.name}!</div>;

// 7. UPDATE TRIP STATUS (using usePostData)
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
