"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Booking = {
  reference: string;
  passengerName: string;
  passengerEmail: string;
  seats: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  cancelledAt: string | null;
};

type Schedule = {
  _id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  originAirportName: string;
  destinationAirportName: string;
  departureLocal: string;
  arrivalLocal: string;
  aircraftName: string;
  capacity: number;
  price: number;
  bookedSeats: number;
  availableSeats: number;
};

type BookingData = {
  booking: Booking;
  schedule: Schedule;
};

export default function BookingInvoicePage() {
  const params = useParams();
  const reference = params.reference as string;

  const [data, setData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  async function loadBooking() {
    try {
      setError("");

      const response = await fetch(`/api/bookings/${reference}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load booking");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelLoading(true);
      setCancelMessage("");
      setError("");

      const response = await fetch(`/api/bookings/${reference}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to cancel booking");
      }

      setCancelMessage("Booking cancelled successfully.");
      await loadBooking();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  }

  useEffect(() => {
    if (reference) {
      loadBooking();
    }
  }, [reference]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <p className="text-slate-600">Loading booking...</p>
        </section>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <a href="/manage" className="text-sm font-semibold text-blue-700">
            ← Back to manage
          </a>

          <div className="mt-6 rounded-2xl bg-red-100 p-6 text-red-700">
            {error}
          </div>
        </section>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const { booking, schedule } = data;
  const isCancelled = booking.status === "cancelled";

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-4xl">
        <a href="/manage" className="text-sm font-semibold text-blue-700">
          ← Back to manage
        </a>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                Booking invoice
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                {booking.reference}
              </h1>

              <p className="mt-2 text-slate-600">
                {booking.passengerName} · {booking.passengerEmail}
              </p>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                isCancelled
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {booking.status.toUpperCase()}
            </div>
          </div>

          {cancelMessage && (
            <div className="mt-6 rounded-xl bg-green-100 p-4 text-green-800">
              {cancelMessage}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Flight</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.flightNumber}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Route</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.originCity} → {schedule.destinationCity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Departure</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.departureLocal}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Arrival</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.arrivalLocal}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Aircraft</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.aircraftName}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Seats</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {booking.seats}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 p-6">
            <div className="flex justify-between border-b border-blue-100 pb-3">
              <span>Price per seat</span>
              <span>${schedule.price}</span>
            </div>

            <div className="flex justify-between border-b border-blue-100 py-3">
              <span>Seats</span>
              <span>{booking.seats}</span>
            </div>

            <div className="flex justify-between pt-3 text-2xl font-bold text-blue-950">
              <span>Total</span>
              <span>${booking.totalPrice}</span>
            </div>
          </div>

          {!isCancelled && (
            <button
              onClick={cancelBooking}
              disabled={cancelLoading}
              className="mt-8 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {cancelLoading ? "Cancelling..." : "Cancel booking"}
            </button>
          )}

          {isCancelled && booking.cancelledAt && (
            <p className="mt-6 text-sm text-slate-600">
              Cancelled at {new Date(booking.cancelledAt).toLocaleString()}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}