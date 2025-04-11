"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/app/store/services/auth";
import { Button } from "@/components/ui/button";
import { AtSign, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
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

// Forgot password form schema with validation
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
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

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      // Call the forgotPassword mutation
      const result = await forgotPassword(data);

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
        result.data.message ||
          "Password reset instructions have been sent to your email."
      );

      // Clear the form
      form.reset();
    } catch (error: unknown) {
      // Fallback error handling
      console.error("Forgot password error:", error);
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
                Forgot Password
              </h2>
              <p className="mt-2 text-gray-600">
                Enter your email address to receive a password reset link
              </p>
            </div>

            {isMobile && (
              <div className="mb-6">
                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 flex items-center mb-4">
                  <Smartphone className="h-5 w-5 text-blue-500 mr-3" />
                  <p className="text-sm text-blue-700">
                    Attempting to open the mobile app...
                  </p>
                </div>

                <Button
                  onClick={() => {
                    const deepLinkPath = token
                      ? `/forgotpassword?token=${token}`
                      : "/forgotpassword";
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

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            </Form>

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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
