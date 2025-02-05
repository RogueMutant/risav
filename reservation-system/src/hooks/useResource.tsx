import { useState, useEffect } from "react";
import { Resource } from "../types/custom";
import { useFetch } from "./useFetch";

const url = "http://localhost:9000/api/resource";

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { loading, data, error, fetchData } = useFetch<Resource[]>(
    url,
    shouldFetch,
    "get"
  );

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
    if (data) {
      console.log(data);
      setResources(data as Resource[]);
    }
  }, [fetchData, data, shouldFetch]);

  const createResource = async (resourceData: Resource) => {
    setShouldFetch(true);
    try {
      fetchData(resourceData);
      if (!data) {
        console.log(error);
      }
      const newResource = (data as Resource[])[0];
      setResources([...resources, newResource]);
    } catch (err) {
      console.error("Error creating resource", error);
    } finally {
      setShouldFetch(false);
    }
  };

  return { resources, createResource, loading, error };
};
