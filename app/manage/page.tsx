"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type PassengerFlight = {
  booking: {
    reference: string;
    passengerName: string;
    passengerEmail: string;
    seats: number;
    status: string;
    totalPrice: number;
  };
  schedule: {
    _id: string;
    flightNumber: string;
    originCity: string;
    destinationCity: string;
    originAirportName: string;
    destinationAirportName: string;
    departureLocal: string;
    arrivalLocal: string;
    aircraftName: string;
    price: number;
  };
};

export default function ManagePage() {
  const router = useRouter();

  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<PassengerFlight[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function findBooking(event: React.FormEvent) {
    event.preventDefault();

    const cleanedReference = reference.trim().toUpperCase();

    if (!cleanedReference) return;

    router.push(`/bookings/${cleanedReference}`);
  }

  async function findPassengerFlights(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setSearched(true);
    setError("");
    setResults([]);

    try {
      const params = new URLSearchParams({
        email,
      });

      const response = await fetch(
        `/api/passenger-flights?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch passenger flights");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            Manage bookings
          </h1>

          <p className="mb-8 text-slate-600">
            Find a booking by reference, cancel an existing booking, or view all
            confirmed flights for a passenger.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <form
              onSubmit={findBooking}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                Find booking
              </h2>

              <p className="mb-4 text-sm text-slate-600">
                Enter a booking reference to view the invoice or cancel the
                booking.
              </p>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Booking reference
                </span>
                <input
                  type="text"
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 uppercase"
                  placeholder="e.g. DFA-8TE3CU"
                  required
                />
              </label>

              <button
                type="submit"
                className="mt-4 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow hover:bg-blue-800"
              >
                View booking
              </button>
            </form>

            <form
              onSubmit={findPassengerFlights}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                Passenger flights
              </h2>

              <p className="mb-4 text-sm text-slate-600">
                Enter a passenger email to see all confirmed scheduled flights
                booked for that passenger.
              </p>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Passenger email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3"
                  placeholder="e.g. hugh@example.com"
                  required
                />
              </label>

              <button
                type="submit"
                className="mt-4 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search passenger flights"}
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-100 p-5 text-red-700">
            {error}
          </div>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-bold text-slate-900">
              No confirmed flights found
            </h2>
            <p className="mt-2 text-slate-600">
              Try another passenger email address.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Confirmed passenger flights
            </h2>

            <div className="grid gap-4">
              {results.map((item) => (
                <article
                  key={item.booking.reference}
                  className="rounded-2xl bg-white p-6 shadow"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        {item.booking.reference} · {item.schedule.flightNumber}
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {item.schedule.originCity} →{" "}
                        {item.schedule.destinationCity}
                      </h3>

                      <p className="mt-2 text-slate-600">
                        {item.schedule.originAirportName} to{" "}
                        {item.schedule.destinationAirportName}
                      </p>

                      <div className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                        <p>
                          <span className="font-semibold">Depart:</span>{" "}
                          {item.schedule.departureLocal}
                        </p>
                        <p>
                          <span className="font-semibold">Arrive:</span>{" "}
                          {item.schedule.arrivalLocal}
                        </p>
                        <p>
                          <span className="font-semibold">Aircraft:</span>{" "}
                          {item.schedule.aircraftName}
                        </p>
                        <p>
                          <span className="font-semibold">Seats:</span>{" "}
                          {item.booking.seats}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5 text-left md:min-w-48 md:text-right">
                      <p className="text-sm text-slate-600">Total price</p>
                      <p className="text-3xl font-bold text-slate-900">
                        ${item.booking.totalPrice}
                      </p>

                      <Link
                        href={`/bookings/${item.booking.reference}`}
                        className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                      >
                        View invoice
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}