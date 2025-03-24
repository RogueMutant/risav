import React, { createContext, useState, useContext, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { Resource } from "../types/custom";

interface ResourceContextType {
  resources: Resource[];
  onCreate: (newResource: Resource) => void;
  fetchResources: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

const ResourceContext = createContext<ResourceContextType | null>(null);

interface ResourceProviderProps {
  children: React.ReactNode;
}

const API_URL = "/api/resource/v1";

export const ResourceProvider: React.FC<ResourceProviderProps> = ({
  children,
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { fetchData: fetchGetData } = useFetch<Resource[]>(
    API_URL,
    false,
    "get"
  );

  const fetchResources = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const fetchedResources = await fetchGetData();
      if (fetchedResources) {
        setResources(fetchedResources);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch resources")
      );
    } finally {
      setLoading(false);
    }
  };

  const onCreate = (newResource: Resource): void => {
    setResources((prevResources) => [...prevResources, newResource]);
  };

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);
  return (
    <ResourceContext.Provider
      value={{
        resources,
        onCreate,
        fetchResources,
        loading,
        error,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResources must be used within a ResourceProvider");
  }
  return context;
};
