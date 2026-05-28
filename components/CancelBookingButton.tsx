"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CancelBookingButtonProps = {
  reference: string;
};

export default function CancelBookingButton({
  reference,
}: CancelBookingButtonProps) {
  const router = useRouter();
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");

  async function cancelBooking() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelLoading(true);
      setError("");

      const response = await fetch(`/api/bookings/${reference}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to cancel booking");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="mt-8">
      {error && (
        <div className="mb-4 rounded-xl bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={cancelBooking}
        disabled={cancelLoading}
        className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {cancelLoading ? "Cancelling..." : "Cancel booking"}
      </button>
    </div>
  );
}