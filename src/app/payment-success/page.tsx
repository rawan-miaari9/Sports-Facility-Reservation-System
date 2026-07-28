"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createReservation } from "@/services/facilityService";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const finishCardReservation = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setMessage("Missing Stripe session. Your reservation was not created.");
        return;
      }

      try {
        const verificationResponse = await fetch(
          `/api/stripe/create-checkout-session?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" }
        );
        const verification = await verificationResponse.json();

        if (!verificationResponse.ok || !verification.paid) {
          throw new Error("Payment was not completed.");
        }

        const processedKey = `stripeReservationCreated:${sessionId}`;
        if (localStorage.getItem(processedKey)) {
          router.replace("/dashboard");
          return;
        }

        const pendingReservation = sessionStorage.getItem("pendingStripeReservation");
        if (!pendingReservation) {
          throw new Error("Booking information could not be recovered.");
        }

        setMessage("Payment confirmed. Creating your reservation...");
        const reservationData = JSON.parse(pendingReservation);
        const result = await createReservation({
          ...reservationData,
          paymentMethod: "Card",
          status: "Confirmed",
        });

        if (!result.success) {
          throw new Error("Failed to create reservation.");
        }

        localStorage.setItem(processedKey, "true");
        sessionStorage.removeItem("pendingStripeReservation");
        router.replace("/dashboard");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Something went wrong.");
      }
    };

    finishCardReservation();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen grid place-items-center bg-background px-6">
      <div className="max-w-md rounded-2xl border border-outline-variant bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-on-surface">Payment Successful</h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
