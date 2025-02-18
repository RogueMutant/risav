import { useState, useEffect, useCallback } from "react";
import { Resource } from "../types/custom";
import { useFetch } from "./useFetch";
import { Storage, ID } from "appwrite";
import { BUCKET_ID_RESOURCE, client } from "../lib/appwrite";
import { useAuth } from "../components/authContext";
import { useResources } from "../components/resourceContext";

const storage = new Storage(client);

export const useResource = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { onCreate } = useResources();
  const { user } = useAuth();

  const { fetchData: createResourceRequest } = useFetch<Resource>(
    "/api/resource/v1",
    false,
    "post"
  );
  const { fetchData: updateResourceRequest } = useFetch<Resource>(
    "/api/resource/v1",
    false,
    "patch"
  );
  const { fetchData: deleteResourceRequest } = useFetch<{ success: boolean }>(
    "/api/resource/v1",
    false,
    "delete"
  );

  const uploadImageToAppwrite = async (imageFile: File) => {
    try {
      const fileId = ID.unique();
      await storage.createFile(BUCKET_ID_RESOURCE, fileId, imageFile);
      return storage.getFileView(BUCKET_ID_RESOURCE, fileId).toString();
    } catch (error) {
      console.error("Error uploading to Appwrite:", error);
      throw error;
    }
  };

  console.time("createTime");
  const createResource = async (resourceData: Omit<Resource, "_id">) => {
    try {
      setIsLoading(true);
      let newImageUrl = null;
      if (resourceData.imageUrl instanceof File) {
        newImageUrl = await uploadImageToAppwrite(resourceData.imageUrl);
        console.log("sending url of image", newImageUrl);
      }
      const newResource = await createResourceRequest({
        ...resourceData,
        imageUrl: newImageUrl as string,
      });

      if (newResource) {
        onCreate(newResource);
      }
      return null;
    } catch (err) {
      setError("Failed to create resource");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  console.timeEnd("createTime");
  const updateResource = async (
    id: string,
    updates: Partial<Resource> & { image?: File }
  ) => {
    try {
      setIsLoading(true);
      let newImageUrl = null;
      if (updates.imageUrl instanceof File) {
        newImageUrl = await uploadImageToAppwrite(updates.imageUrl);
      }
      const updatedResource = await updateResourceRequest({
        _id: id,
        ...updates,
        imageUrl: newImageUrl || updates.imageUrl,
      });
      if (updatedResource) {
        setResources((prev) =>
          prev.map((resource) =>
            resource._id === id ? updatedResource : resource
          )
        );
        return updatedResource;
      }
      return null;
    } catch (err) {
      setError("Failed to update resource");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await deleteResourceRequest({ _id: id });
      if (result?.success) {
        setResources((prev) => prev.filter((resource) => resource._id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete resource");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resources,
    createResource,
    updateResource,
    deleteResource,
    isLoading,
    error,
  };
};
