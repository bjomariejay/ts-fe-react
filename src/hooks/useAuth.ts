import { useState } from "react";
import { login as loginRequest } from "../api/auth.api";
import { AuthenticatedUser } from "../types/auth";

interface LoginResult {
  success: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    setError("");
    try {
      const response = await loginRequest({ username, password });
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      setError(response.message ?? "Unable to login");
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
    setUser(null);
  };

  const clearError = () => setError("");

  return { user, login, logout, error, clearError, isLoading };
};
