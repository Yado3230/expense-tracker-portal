"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useResetPasswordMutation } from "@/app/store/services/auth";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, KeyRound, Smartphone } from "lucide-react";
import Link from "next/link";
import { openAppLink } from "@/lib/appLink";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Reset password form schema with validation
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if user is on mobile
    setIsMobile(
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );

    // Try to open the app if on mobile
    if (typeof window !== "undefined") {
      const deepLinkPath = token
        ? `/forgotpassword?token=${token}`
        : "/forgotpassword";

      openAppLink(deepLinkPath);
    }
  }, [token]);

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      setErrorMessage("Invalid or missing reset token. Please try again.");
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Call the resetPassword mutation
      const result = await resetPassword({
        token,
        password: data.password,
      });

      if ("error" in result) {
        // Handle error case
        const errorData = result.error as { data?: { message?: string } };
        setErrorMessage(
          errorData?.data?.message ||
            "There was an error processing your request. Please try again."
        );
        return;
      }

      // Success case - result.data contains the response
      setSuccessMessage(
        result.data.message || "Your password has been successfully reset."
      );

      // Clear the form
      form.reset();

      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: unknown) {
      // Fallback error handling
      console.error("Reset password error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Reset Password
              </h2>
              <p className="mt-2 text-gray-600">
                Create a new password for your account
              </p>
            </div>

            {isMobile && token && (
              <div className="mb-6">
                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 flex items-center mb-4">
                  <Smartphone className="h-5 w-5 text-blue-500 mr-3" />
                  <p className="text-sm text-blue-700">
                    Attempting to open the mobile app...
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const deepLinkPath = `/resetpassword?token=${token}`;
                    openAppLink(deepLinkPath);
                  }}
                  className="w-full mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200"
                  variant="outline"
                >
                  Open in Mobile App
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Or continue on the web:
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 flex items-center p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 flex items-center p-4 rounded-xl bg-green-50 border-l-4 border-green-500">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {!token ? (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Please request a new password reset link.
                </p>
                <Link href="/auth/forgotpassword">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Go to Forgot Password
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          New Password
                        </FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Confirm Password
                        </FormLabel>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your password"
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
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
