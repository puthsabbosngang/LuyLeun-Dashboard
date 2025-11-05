"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.type === "staff") {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  );
}
