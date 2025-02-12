import { useCallback, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

interface UseFetchState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  fetchData: (
    body?: any,
    method?: "get" | "post" | "put" | "delete"
  ) => Promise<T | null>;
}

const BASE_URL = "http://localhost:9000"; // Ensure this matches your backend

export const useFetch = <T,>(
  url: string, // url should be relative, e.g., "/auth/login"
  shouldFetch: boolean = false,
  defaultMethod: "get" | "post" | "put" | "delete" = "get"
): UseFetchReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (
      body?: any,
      method: "get" | "post" | "put" | "delete" = defaultMethod
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const config: AxiosRequestConfig = {
          method: method,
          url: `${BASE_URL}${url}`, // ✅ Ensure correct backend URL
          withCredentials: true,
        };

        if (body) {
          config.data = body;
        }

        const response = await axios.request<T>(config);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [fetchData, shouldFetch]);

  return { loading, data, error, fetchData };
};
