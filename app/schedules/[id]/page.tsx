"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Schedule = {
  _id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  originAirportName: string;
  destinationAirportName: string;
  originTimezone: string;
  destinationTimezone: string;
  departureLocal: string;
  arrivalLocal: string;
  aircraftName: string;
  capacity: number;
  price: number;
  bookedSeats: number;
  availableSeats: number;
};

export default function ScheduleDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [seats, setSeats] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false); 
  useEffect(() => {
    async function loadSchedule() {
      try {
        const response = await fetch(`/api/schedules/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load schedule");
        }

        setSchedule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadSchedule();
    }
  }, [id]);
      async function handleBooking(event: React.FormEvent) {
    event.preventDefault();

    if (!schedule) return;

    setBookingLoading(true);
    setBookingError("");
    setBookingMessage("");
    setBookingReference("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId: schedule._id,
          passengerName,
          passengerEmail,
          seats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      router.push(`/bookings/${data.booking.reference}`);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <p className="text-slate-600">Loading flight details...</p>
        </section>
      </main>
    );
  }

  if (error || !schedule) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <Link href="/schedules" className="text-sm font-semibold text-blue-700">
            ← Back to search
          </Link>

          <div className="mt-6 rounded-2xl bg-red-100 p-6 text-red-700">
            {error || "Schedule not found"}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-4xl">
        <Link href="/schedules" className="text-sm font-semibold text-blue-700">
          ← Back to search
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
            {schedule.flightNumber}
          </p>

          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            {schedule.originCity} → {schedule.destinationCity}
          </h1>

          <p className="mb-8 text-slate-600">
            {schedule.originAirportName} to {schedule.destinationAirportName}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Departure</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.departureLocal} ({schedule.originTimezone})
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Arrival</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.arrivalLocal} ({schedule.destinationTimezone})
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Aircraft</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.aircraftName}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Seats available</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {schedule.availableSeats} / {schedule.capacity}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 p-6">
            <p className="text-sm text-blue-900">Price per seat</p>
            <p className="text-4xl font-bold text-blue-950">
              ${schedule.price}
            </p>
          </div>
            <form
    onSubmit={handleBooking}
    className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"
    >
    <h2 className="mb-4 text-2xl font-bold text-slate-900">
        Book this flight
    </h2>

    {bookingMessage && (
        <div className="mb-4 rounded-xl bg-green-100 p-4 text-green-800">
        <p className="font-semibold">{bookingMessage}</p>
        <p>
            Your booking reference is{" "}
            <span className="font-bold">{bookingReference}</span>
        </p>
        </div>
    )}

    {bookingError && (
        <div className="mb-4 rounded-xl bg-red-100 p-4 text-red-700">
        {bookingError}
        </div>
    )}

    {schedule.availableSeats <= 0 ? (
        <div className="rounded-xl bg-red-100 p-4 text-red-700">
        This flight is fully booked.
        </div>
    ) : (
        <>
        <div className="grid gap-4 md:grid-cols-2">
            <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
                Passenger name
            </span>
            <input
                type="text"
                value={passengerName}
                onChange={(event) => setPassengerName(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 p-3"
                placeholder="e.g. Alice Wang"
            />
            </label>

            <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
                Passenger email
            </span>
            <input
                type="email"
                value={passengerEmail}
                onChange={(event) => setPassengerEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 p-3"
                placeholder="e.g. alice@example.com"
            />
            </label>

            <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
                Number of seats
            </span>
            <input
                type="number"
                min="1"
                max={schedule.availableSeats}
                value={seats}
                onChange={(event) => setSeats(Number(event.target.value))}
                required
                className="w-full rounded-xl border border-slate-300 p-3"
            />
            </label>

            <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total price</p>
            <p className="text-2xl font-bold text-slate-900">
                ${seats * schedule.price}
            </p>
            </div>
        </div>

        <button
            type="submit"
            disabled={bookingLoading}
            className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
            {bookingLoading ? "Creating booking..." : "Confirm booking"}
        </button>
        </>
    )}
    </form>
        </div>
      </section>
    </main>
  );
}