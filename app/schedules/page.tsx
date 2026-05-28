"use client";

import Link from "next/link";
import { useState } from "react";

const airports = [
  { code: "NZNE", label: "Dairy Flat (NZNE)" },
  { code: "YSSY", label: "Sydney (YSSY)" },
  { code: "NZRO", label: "Rotorua (NZRO)" },
  { code: "NZGB", label: "Great Barrier Island / Claris (NZGB)" },
  { code: "NZCI", label: "Chatham Islands / Tuuta (NZCI)" },
  { code: "NZTL", label: "Lake Tekapo (NZTL)" },
];

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

export default function SchedulesPage() {
  const [orig, setOrig] = useState("NZNE");
  const [dest, setDest] = useState("YSSY");
  const [date1, setDate1] = useState("2026-06-10");
  const [date2, setDate2] = useState("2026-06-30");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  async function searchSchedules(event: React.FormEvent) {
    event.preventDefault();
    if (orig === dest) {
      setSearched(true);
      setSchedules([]);
      setError("Origin and destination must be different.");
      return;
    }
    setLoading(true);
    setSearched(true);
    setError("");

    try {
      const params = new URLSearchParams({
        orig,
        dest,
        date1,
        date2,
      });

      const response = await fetch(`/api/schedules?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search schedules");
      }

      setSchedules(data.schedules || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-semibold text-blue-700">
            ← Back to home
          </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
            Dairy Flat Air
          </p>

          <h1 className="mb-3 text-3xl font-bold text-slate-900">
            Search scheduled flights
          </h1>

          <p className="mb-8 text-slate-600">
            Choose an origin, destination, and date range. Some routes operate
            only a few times per week, so using a date range makes it easier to
            find available flights.
          </p>

          <form
            onSubmit={searchSchedules}
            className="grid gap-4 md:grid-cols-5"
          >
            <label className="md:col-span-1">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Origin
              </span>
              <select
                value={orig}
                onChange={(event) => setOrig(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3"
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-1">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Destination
              </span>
              <select
                value={dest}
                onChange={(event) => setDest(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3"
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                From
              </span>
              <input
                type="date"
                value={date1}
                onChange={(event) => setDate1(event.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                To
              </span>
              <input
                type="date"
                value={date2}
                onChange={(event) => setDate2(event.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow hover:bg-blue-800"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm text-blue-900">
          <p className="font-semibold">Route guide</p>
          <p>
            Sydney flights depart Dairy Flat on Fridays. Rotorua flights operate
            twice every weekday. Great Barrier Island flights depart Monday,
            Wednesday, and Friday. Chatham Islands flights depart Tuesday and
            Friday. Lake Tekapo flights depart Monday.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-100 p-5 text-red-700">
            {error}
          </div>
        )}

        {searched && !loading && schedules.length === 0 && !error && (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-bold text-slate-900">
              No flights found
            </h2>
            <p className="mt-2 text-slate-600">
              Try using a wider date range or a different route.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {schedules.map((schedule) => (
            <article
              key={schedule._id}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    {schedule.flightNumber}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {schedule.originCity} → {schedule.destinationCity}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    {schedule.originAirportName} to{" "}
                    {schedule.destinationAirportName}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                    <p>
                      <span className="font-semibold">Depart:</span>{" "}
                      {schedule.departureLocal} ({schedule.originTimezone})
                    </p>
                    <p>
                      <span className="font-semibold">Arrive:</span>{" "}
                      {schedule.arrivalLocal} ({schedule.destinationTimezone})
                    </p>
                    <p>
                      <span className="font-semibold">Aircraft:</span>{" "}
                      {schedule.aircraftName}
                    </p>
                    <p>
                      <span className="font-semibold">Seats left:</span>{" "}
                      {schedule.availableSeats} / {schedule.capacity}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 text-left md:min-w-48 md:text-right">
                  <p className="text-sm text-slate-600">Price per seat</p>
                  <p className="text-3xl font-bold text-slate-900">
                    ${schedule.price}
                  </p>

                  <Link
                    href={`/schedules/${schedule._id}`}
                    className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                  >
                    Select flight
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}