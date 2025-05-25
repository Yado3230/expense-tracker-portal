"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation } from "@/app/store/services/auth";
import { Loading } from "@/components/ui/loading";
import { useAuth } from "@/lib/auth";
import { AtSign, KeyRound, AlertTriangle } from "lucide-react";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Login form schema with validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const { setAuthUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear any existing admin status when the login page loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only run on client side
      const currentIsAdmin = localStorage.getItem("isAdmin");

      // If user was redirected from dashboard due to not being admin
      if (currentIsAdmin === "false") {
        setErrorMessage(
          "Access denied. Only administrators can log in to this portal."
        );
      }
    }
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setErrorMessage(null);

      // Call the login mutation
      const result = await login(data);

      if ("error" in result) {
        // Handle error case
        const errorData = result.error as { data?: { message?: string } };
        setErrorMessage(
          errorData?.data?.message ||
            "Invalid email or password. Please try again."
        );
        return;
      }

      // Success case - result.data contains the response
      const response = result.data;

      // Check admin status before setting auth user
      const isAdmin = await checkAdminStatus(response.token);

      if (isAdmin) {
        // User is admin, set auth user and redirect to dashboard
        setAuthUser(response.user, response.token);
        localStorage.setItem("isAdmin", "true");
        Cookies.set("isAdmin", "true", {
          expires: 7, // 7 days
          path: "/",
          sameSite: "strict",
        });
        router.push("/dashboard");
      } else {
        // User is not admin, show error message
        setErrorMessage(
          "Access denied. Only administrators can log in to this portal."
        );
        // Don't set auth user for non-admins
        localStorage.setItem("isAdmin", "false");
        Cookies.set("isAdmin", "false", {
          expires: 7,
          path: "/",
          sameSite: "strict",
        });
      }
    } catch (error: unknown) {
      // Fallback error handling
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  }

  // Function to check admin status, returns true if admin, false otherwise
  const checkAdminStatus = async (token: string): Promise<boolean> => {
    try {
      // Make a request to the users endpoint (admin-only)
      const response = await fetch(
        "https://expense-tracker-backend-eight.vercel.app/api/users?page=0&size=1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If response is not ok, user is not admin
      if (!response.ok) {
        console.log("User is not an admin (request failed)");
        return false;
      }

      try {
        // Parse the response JSON
        const data = await response.json();

        // Check if the response contains an error message
        if (data && data.message === "Access denied, admin only") {
          console.log("User is not an admin:", data.message);
          return false;
        }

        // Success with actual data and no error message means user is admin
        console.log("User is an admin");
        return true;
      } catch (parseError) {
        console.error("Error parsing admin check response:", parseError);
        return false;
      }
    } catch (error) {
      // If request fails, user is not an admin
      console.error("Admin check request failed:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Left side - Branding and Illustration */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Expense Tracker
                  </h1>
                  <p className="mt-4 text-xl text-gray-600">
                    Take control of your financial journey with our intuitive
                    platform
                  </p>
                </div>

                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-3xl"></div>
                    <div className="relative p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Track Expenses
                            </h3>
                            <p className="text-sm text-gray-500">
                              Monitor your spending habits
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Set Budgets
                            </h3>
                            <p className="text-sm text-gray-500">
                              Plan your financial goals
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Sign in to continue to your account
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-6 flex items-center p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Email Address
                            </FormLabel>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <AtSign className="h-5 w-5 text-gray-400" />
                              </div>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  className="h-12 pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Password
                              </FormLabel>
                              <Link
                                href="/auth/forgotpassword"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <KeyRound className="h-5 w-5 text-gray-400" />
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  className="h-12 pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage className="text-sm" />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <Loading size="sm" text="" className="mr-2" />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/auth/register"
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>

                  <p className="mt-8 text-center text-xs text-gray-500">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
