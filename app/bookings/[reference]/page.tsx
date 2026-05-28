import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import CancelBookingButton from "@/components/CancelBookingButton";
type Booking = {
  reference: string;
  passengerName: string;
  passengerEmail: string;
  seats: number;
  status: string;
  totalPrice: number;
  createdAt: Date;
  cancelledAt: Date | null;
};

type ScheduleDocument = {
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
  bookings: Booking[];
};

type BookingInvoicePageProps = {
  params: Promise<{
    reference: string;
  }>;
};

async function getBookingData(reference: string) {
  const db = await getDb();

  const schedule = await db.collection<ScheduleDocument>("schedules").findOne({
    "bookings.reference": reference,
  });

  if (!schedule) {
    return null;
  }

  const booking = schedule.bookings.find(
    (item) => item.reference === reference
  );

  if (!booking) {
    return null;
  }

  return {
    booking,
    schedule: {
      flightNumber: schedule.flightNumber,
      origin: schedule.origin,
      destination: schedule.destination,
      originCity: schedule.originCity,
      destinationCity: schedule.destinationCity,
      originAirportName: schedule.originAirportName,
      destinationAirportName: schedule.destinationAirportName,
      originTimezone: schedule.originTimezone,
      destinationTimezone: schedule.destinationTimezone,
      departureLocal: schedule.departureLocal,
      arrivalLocal: schedule.arrivalLocal,
      aircraftName: schedule.aircraftName,
      capacity: schedule.capacity,
      price: schedule.price,
    },
  };
}

export default async function BookingInvoicePage({
  params,
}: BookingInvoicePageProps) {
  const { reference } = await params;
  const data = await getBookingData(reference);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <nav className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/manage" className="text-blue-700 hover:text-blue-900">
              ← Manage bookings
            </Link>
            <Link
              href="/schedules"
              className="text-blue-700 hover:text-blue-900"
            >
              Search another flight
            </Link>
            <Link href="/" className="text-blue-700 hover:text-blue-900">
              Home
            </Link>
          </nav>

          <div className="mt-6 rounded-2xl bg-red-100 p-6 text-red-700">
            Booking not found
          </div>
        </section>
      </main>
    );
  }

  const { booking, schedule } = data;
  const isCancelled = booking.status === "cancelled";

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-4xl">
        <nav className="flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/manage" className="text-blue-700 hover:text-blue-900">
            ← Manage bookings
          </Link>
          <Link href="/schedules" className="text-blue-700 hover:text-blue-900">
            Search another flight
          </Link>
          <Link href="/" className="text-blue-700 hover:text-blue-900">
            Home
          </Link>
        </nav>

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

            {!isCancelled && <CancelBookingButton reference={booking.reference} />}

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