"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { User } from "@/app/store/services/auth";
import Cookies from "js-cookie";

type TokenPayload = {
  userId: string;
  exp: number;
};

type SerializableUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<SerializableUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check both cookie (for SSR/middleware) and localStorage (for client-side)
      const token =
        Cookies.get("access_token") || localStorage.getItem("access_token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Decode and validate the token
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token expired
          Cookies.remove("access_token");
          localStorage.removeItem("access_token");
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Token valid
          setIsAuthenticated(true);

          // Try to get user from localStorage if available
          try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser) as SerializableUser;
              setUser(parsedUser);
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
            // Invalid user data in storage, reset it
            localStorage.removeItem("user");
          }
        }
      } catch {
        // Invalid token
        Cookies.remove("access_token");
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Set up event listener for storage changes (for multi-tab support)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const logout = () => {
    Cookies.remove("access_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/auth/login");
  };

  const setAuthUser = (userData: User, token: string) => {
    // Ensure userData is serializable by handling Date objects
    const serializableUser: SerializableUser = {
      ...userData,
      // Convert any date objects to strings if present
      createdAt: userData.createdAt?.toString(),
      updatedAt: userData.updatedAt?.toString(),
    };

    // Set cookie with appropriate settings
    Cookies.set("access_token", token, {
      expires: 7, // 7 days
      path: "/",
      sameSite: "strict",
    });

    // Store in localStorage for client-side access
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(serializableUser));

    setUser(serializableUser);
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    setAuthUser,
  };
}
