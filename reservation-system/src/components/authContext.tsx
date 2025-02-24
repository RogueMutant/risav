import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { User, Resource, Category } from "../types/custom";
import { useNavigate } from "react-router-dom";
import { Storage, ID } from "appwrite";
import { BUCKET_ID_USER_IMAGE, client } from "../lib/appwrite";

interface AuthContextType {
  user: User | null;
  userResources: Resource[];
  userCategories: Category[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (
    email: string,
    name: string,
    phoneNo: string,
    password?: string,
    profileImage?: File
  ) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const storage = new Storage(client);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userResources, setUserResources] = useState<Resource[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchData: fetchUserData, error: getCurrentError } = useFetch<{
    user: User;
  }>("/auth/me", false, "get");
  const { fetchData: fetchUserResources } = useFetch<Resource[]>(
    "/api/resource/v1",
    false,
    "get"
  );
  const { fetchData: fetchUserCategories } = useFetch<Category[]>(
    "/api/categories/v1",
    false,
    "get"
  );
  const { fetchData: loginRequest } = useFetch<{ user: User }>(
    "/auth/login",
    false,
    "post"
  );
  const { fetchData: logoutRequest } = useFetch("/auth/logout", false, "post");
  const { fetchData: updateRequest } = useFetch(
    "/auth/updateProfile",
    false,
    "patch"
  );

  const uploadImageToAppwrite = async (imageFile: File) => {
    try {
      const fileId = ID.unique();
      await storage.createFile(BUCKET_ID_USER_IMAGE, fileId, imageFile);
      return storage.getFileView(BUCKET_ID_USER_IMAGE, fileId).toString();
    } catch (error) {
      console.error("Error uploading to Appwrite:", error);
      throw error;
    }
  };

  const fetchCompleteUserData = async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch the latest user data
      const userData = await fetchUserData();
      if (!userData?.user) {
        throw new Error("User data not found");
      }

      // Fetch resources and categories in parallel
      const [resources, categories] = await Promise.all([
        fetchUserResources(),
        fetchUserCategories(),
      ]);

      let profileImageUrl = userData.user.profileImageUrl;

      // Ensure profileImageUrl is a string before using getFileView
      if (typeof profileImageUrl === "string") {
        try {
          profileImageUrl = storage
            .getFileView(BUCKET_ID_USER_IMAGE, profileImageUrl)
            .toString();
        } catch (err) {
          console.error("Error fetching profile image:", err);
        }
      }

      // Ensure `_id` is mapped to `id`
      const updatedUser: User = {
        ...userData.user,
        _id: userData.user._id,
        profileImageUrl,
      };

      // Update state
      if (resources) setUserResources(resources);
      if (categories) setUserCategories(categories);
      console.log("Updated user:", updatedUser);

      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
      console.error("Error fetching user data:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (user?._id) {
      await fetchCompleteUserData();
    }
  };

  // Initial user data fetch
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const userData = await fetchUserData();
        console.log("userData:", userData);
        if (getCurrentError) {
          console.log("getCuurrentUSer error: ", getCurrentError);
        }

        if (userData?.user) {
          setUser(userData.user);
          await fetchCompleteUserData();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize user data"
        );
        console.error("Error initializing user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      if (!response?.user || !response.user?._id) {
        throw new Error("Invalid login response: User data is missing");
      }

      // Fetch complete user data from the database
      const fullUserData = await fetchCompleteUserData();

      setUser(fullUserData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutRequest();
      setUser(null);
      setUserResources([]);
      setUserCategories([]);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    email: string,
    name: string,
    phoneNumber: string,
    password?: string,
    profileImage?: File
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?._id) {
        throw new Error("User ID is missing");
      }

      let newProfileImageUrl = null;

      if (profileImage) {
        newProfileImageUrl = await uploadImageToAppwrite(profileImage);
      }

      const updateData: Record<string, any> = {
        email,
        name,
        phoneNumber,
        userId: user?._id,
      };

      if (password) {
        updateData.password = password;
      }

      if (newProfileImageUrl) {
        updateData.profileImageUrl = newProfileImageUrl;
      }

      // Send request to update user details in MongoDB
      const response = await updateRequest(updateData);

      if (!response) {
        throw new Error("Failed to update user details");
      }

      const updatedUser = response;
      console.log("Updated user from profile update request: ", updatedUser);

      // Update AuthContext with the new user data
      setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userResources,
        userCategories,
        login,
        logout,
        updateUser,
        refreshUserData,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
