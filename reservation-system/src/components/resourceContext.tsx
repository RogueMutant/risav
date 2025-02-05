import React, { createContext, useState, useContext } from "react";
import { useFetch } from "../hooks/useFetch";
import { Resource } from "../types/custom";

interface ResourceContextType {
  resources: Resource[];
  createResource: (resourceData: Omit<Resource, "id">) => Promise<void>;
  loading: boolean;
}

const ResourceContext = createContext<ResourceContextType | null>(null);

interface ResourceProviderProps {
  children: React.ReactNode;
}

const url = "/api/resources";

export const ResourceProvider: React.FC<ResourceProviderProps> = ({
  children,
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  const { fetchData } = useFetch<Resource>(url, false, "post");

  const createResource = async (
    resourceData: Omit<Resource, "id">
  ): Promise<void> => {
    setLoading(true);
    try {
      // Call the API to create the resource
      // const newResource = await fetchData(resourceData);
      const newResource = resourceData;
      // If the API call is successful, update the resources array
      if (newResource) {
        setResources((prevResources) => [...prevResources, newResource]);
      }
    } catch (err) {
      console.error("Error creating resource", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResourceContext.Provider value={{ resources, createResource, loading }}>
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
