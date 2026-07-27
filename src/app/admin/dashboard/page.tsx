"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminMainDashboard from "@/components/admin/AdminMainDashboard";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth");
      return;
    }

    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Verifying authorization...
        </p>
      </div>
    );
  }

  return isAuthenticated ? <AdminMainDashboard /> : null;
}