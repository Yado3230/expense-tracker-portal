"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { openAppLink } from "@/lib/appLink";

const RootPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <Button>Click me</Button>

      <Button
        onClick={() => openAppLink("/dashboard")}
        variant="outline"
        className="mt-4"
      >
        Open in Mobile App
      </Button>
    </div>
  );
};

export default RootPage;
