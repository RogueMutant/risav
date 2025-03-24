import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useFetch } from "../hooks/useFetch";
import { User, Resource, Category, Reservation } from "../types/custom";
import { useNavigate } from "react-router-dom";
import { Storage, ID } from "appwrite";
import { BUCKET_ID_USER_IMAGE, client } from "../lib/appwrite";

interface AuthContextType {
  user: User | null;
  allUsers: User[] | null;
  userResources: Resource[];
  userCategories: Category[];
  reservations: Reservation[];
  getAllUsers: () => Promise<void>;
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
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [userResources, setUserResources] = useState<Resource[]>([]);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [reservations, setReservation] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchData: fetchUserData, error: getCurrentError } = useFetch<{
    user: User;
  }>("/auth/me", false, "get");
  const { fetchData: fetchAllUser, error: getAllUserError } = useFetch<{
    all_users: User[];
  }>("/auth/all-users", false, "get");

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
  const { fetchData: loginRequest, error: loginError } = useFetch<{
    user: User;
  }>("/auth/login", false, "post");
  const { fetchData: logoutRequest } = useFetch("/auth/logout", false, "post");
  const { fetchData: updateRequest } = useFetch(
    "/auth/updateProfile",
    false,
    "patch"
  );

  const { fetchData: allMyReservation } = useFetch<Reservation[]>(
    "/api/reservations/get-my-reservations/v1",
    false,
    "get"
  );

  const getAllUsers = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAllUser();
      console.log("API Response:", response);

      if (response?.all_users) {
        setAllUsers(response.all_users);
      } else {
        console.error("Unexpected response format:", response);
        setAllUsers([]);
      }

      console.log("Gotten all users:", response?.all_users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(
        error instanceof Error ? error.message : "Failed to retrieve users"
      );
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllUser]);

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

      const userData = await fetchUserData();
      if (!userData?.user) {
        throw new Error("User data not found");
      }

      const [resources, categories, allReservations] = await Promise.all([
        fetchUserResources(),
        fetchUserCategories(),
        allMyReservation(),
      ]);

      let profileImageUrl = userData.user.profileImageUrl;

      if (typeof profileImageUrl === "string") {
        try {
          profileImageUrl = storage
            .getFileView(BUCKET_ID_USER_IMAGE, profileImageUrl)
            .toString();
        } catch (err) {
          console.error("Error fetching profile image:", err);
        }
      }

      const updatedUser: User = {
        ...userData.user,
        _id: userData.user._id,
        profileImageUrl,
      };

      // Update state
      if (resources) setUserResources(resources);
      if (categories) setUserCategories(categories);
      if (allReservations) setReservation(allReservations);
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
    try {
      setIsLoading(true);
      setError(null);
      if (user?._id) {
        await fetchCompleteUserData();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not refresh user data"
      );
    } finally {
      setIsLoading(false);
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
      setError("");
      setIsLoading(true);
      setError(null);

      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      if (!response) {
        throw new Error("No network");
      }

      if (!response?.user || !response.user?._id) {
        throw new Error("Invalid login response: User data is missing");
      }

      // Fetch complete user data from the database
      const fullUserData = await fetchCompleteUserData();

      setUser(fullUserData);
      if (user?.role === "super_admin" && "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? loginError : "Login failed");
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
        reservations,
        getAllUsers,
        allUsers,
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
