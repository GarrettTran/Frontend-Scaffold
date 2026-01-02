import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import { AsyncQueue } from "./asyncQueue";
import { API_ENDPOINTS } from "@/shared/api.config";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const client = axios.create({
  headers: DEFAULT_HEADERS,
});


let isRefreshing = false;
const refreshQueue = new AsyncQueue<string>();


client.interceptors.request.use((config) => {
  if(config.skipAuth) {
    delete config.headers?.Authorization;
    return config
  }
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject({
        type: "network_error",
        message: "Network error. Please check your connection.",
      });
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        const token = await refreshQueue.enqueue();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return client(originalRequest);
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        const res = await client.post(API_ENDPOINTS.auth.refresh, { refreshToken }, {skipAuth: true});

        const { accessToken: token, refreshToken: newRefreshToken } = res.data.data;

        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", newRefreshToken);

        refreshQueue.resolveAll(token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return client(originalRequest);
      } catch (err) {
        refreshQueue.rejectAll(err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/auth";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export async function apiGet<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const res = await client.get<T>(url, options);
  return res.data;
}

export async function apiPost<T, B = unknown>(
  url: string,
  body: B,
  options?: AxiosRequestConfig
): Promise<T> {
  const res = await client.post<T>(url, body, options);
  return res.data;
}

export async function apiPut<T, B = unknown>(
  url: string,
  body: B,
  options?: AxiosRequestConfig
): Promise<T> {
  const res = await client.put<T>(url, body, options);
  return res.data;
}

export async function apiPatch<T, B = unknown>(
  url: string,
  body: B,
  options?: AxiosRequestConfig
): Promise<T> {
  const res = await client.patch<T>(url, body, options);
  return res.data;
}

export async function apiDelete<T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const res = await client.delete<T>(url, options);
  return res.data;
}
