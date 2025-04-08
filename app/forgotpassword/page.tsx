"use client";

import { useEffect } from "react";
import { openAppLink } from "@/lib/appLink";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  useEffect(() => {
    // Automatically try to open the app when the page loads
    openAppLink("/forgotpassword");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <p>Attempting to open the mobile app...</p>

      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-2">
          If the app doesn&apos;t open automatically:
        </p>
        <Button
          onClick={() => openAppLink("/forgotpassword")}
          className="w-full"
        >
          Open in Mobile App
        </Button>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Or continue on the web:</p>
        <form className="flex flex-col gap-2 w-full max-w-sm">
          <input
            type="email"
            placeholder="Email address"
            className="p-2 border rounded"
          />
          <Button type="submit" variant="outline">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
