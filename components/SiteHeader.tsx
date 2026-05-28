import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Dairy Flat Air
        </Link>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/schedules" className="text-slate-600 hover:text-blue-700">
            Search flights
          </Link>

          <Link href="/manage" className="text-slate-600 hover:text-blue-700">
            Manage bookings
          </Link>

          <Link
            href="/schedules"
            className="rounded-xl bg-blue-700 px-4 py-2 text-white shadow hover:bg-blue-800"
          >
            Book now
          </Link>
        </div>
      </nav>
    </header>
  );
}