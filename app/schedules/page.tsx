export default function SchedulesPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <section className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-semibold text-blue-700">
          ← Back to home
        </a>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Search flights
          </h1>

          <p className="text-slate-600">
            This page will allow customers to search for scheduled flights by
            origin, destination, and date range.
          </p>
        </div>
      </section>
    </main>
  );
}