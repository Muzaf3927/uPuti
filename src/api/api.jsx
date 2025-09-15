import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { VITE_API_BASE } = import.meta.env;

const api = axios.create({
  baseURL: VITE_API_BASE,
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

    const { data } = await axios.post(`${VITE_BASE_URL}/refresh-token`, {
      refresh_token: refreshToken,
    });

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
  const { data } = await api.post(url, body);
  return data;
};

export const deleteData = async (url) => {
  const { data } = await api.delete(url);
  return data;
};

// Example usage with TanStack Query
export const useGetData = (url) => {
  return useQuery(["data", url], () => getData(url));
};

export const usePostData = (url) => {
  const queryClient = useQueryClient();
  return useMutation((body) => postData(url, body), {
    onSuccess: () => {
      queryClient.invalidateQueries(["data", url]);
    },
  });
};

export const useDeleteData = (url) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteData(url), {
    onSuccess: () => {
      queryClient.invalidateQueries(["data", url]);
    },
  });
};
