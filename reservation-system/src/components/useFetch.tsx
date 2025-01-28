import { useCallback, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

interface UseFetchState<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  fetchData: (body?: any) => Promise<void>;
}

export const useFetch = <T,>(
  url: string,
  shouldFetch: boolean,
  reqMethod: "get" | "post" | "put" | "delete"
): UseFetchReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (body?: any) => {
      if (!shouldFetch) return;
      setLoading(true);

      try {
        const config: AxiosRequestConfig = {
          method: reqMethod,
          url: url,
        };

        if (body) {
          config.data = body;
        }

        const response = await axios.request<T>(config);
        setData(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
    [url, reqMethod, shouldFetch]
  );

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [fetchData, shouldFetch]);

  return { loading, data, error, fetchData };
};
