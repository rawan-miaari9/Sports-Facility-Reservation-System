import { AuthForm } from "@/components/auth/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Athletic Hub",
  description: "Access your Athletic Hub account to book sports facilities, manage reservations, and view your dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthPage() {
  return <AuthForm />;
}