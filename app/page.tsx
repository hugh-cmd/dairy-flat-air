export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-700">
          Dairy Flat Air
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900">
          Premium regional flights from Dairy Flat
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-slate-600">
          Search and book scheduled flights to Sydney, Rotorua, Great Barrier
          Island, Chatham Islands, and Lake Tekapo.
        </p>

        <div className="flex gap-4">
          <a
            href="/schedules"
            className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow hover:bg-blue-800"
          >
            Search flights
          </a>

          <a
            href="/manage"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow hover:bg-slate-50"
          >
            Manage booking
          </a>
        </div>
      </section>
    </main>
  );
}