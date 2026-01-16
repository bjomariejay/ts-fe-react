import { useEffect, useState } from "react";
import { getCurrentUser, login as loginRequest } from "../api/auth.api";
import { AuthenticatedUser } from "../types/auth";
import { clearStoredToken, getStoredToken, persistToken } from "../utils/authStorage";

interface LoginResult {
  success: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          clearStoredToken();
        }
      } catch (err) {
        console.error(err);
        clearStoredToken();
        setError("Session expired. Please sign in again.");
      } finally {
        setIsBootstrapping(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setError("Session expired. Please sign in again.");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    setError("");
    try {
      const response = await loginRequest({ username, password });
      if (response.success && response.user && response.token) {
        persistToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      setError(response.message ?? "Unable to login");
      clearStoredToken();
      return { success: false };
    } catch (err: unknown) {
      const fallback = "Login failed. Please try again.";
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message ?? fallback);
      } else {
        setError(fallback);
      }
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
  };

  const clearError = () => setError("");

  return { user, login, logout, error, clearError, isLoading, isBootstrapping };
};
