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
    method?: "get" | "post" | "patch" | "delete"
  ) => Promise<T | null>;
}

const BASE_URL = "http://localhost:9000";

export const useFetch = <T,>(
  url: string, // url should be relative, e.g., "/auth/login"
  shouldFetch: boolean = false,
  defaultMethod: "get" | "post" | "patch" | "delete" = "get"
): UseFetchReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (
      body?: any,
      method: "get" | "post" | "patch" | "delete" = defaultMethod
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const config: AxiosRequestConfig = {
          method: method,
          url: `${BASE_URL}${url}`,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (body) {
          config.data = body;
          console.log("Request body:", body);
        }

        console.log("Request config:", config);
        const response = await axios.request<T>(config);
        console.log("Response:", response);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        console.error("Full error:", err);
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, defaultMethod]
  );

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [fetchData, shouldFetch]);

  return { loading, data, error, fetchData };
};
