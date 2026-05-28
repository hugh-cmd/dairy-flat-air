import Link from "next/link";

const routes = [
  "NZNE → YSSY",
  "NZNE → NZRO",
  "NZNE → NZGB",
  "NZNE → NZCI",
  "NZNE → NZTL",
];
const fleet = [
  {
    name: "SyberJet SJ30i",
    seats: "6 seats",
    use: "Sydney prestige service",
  },
  {
    name: "Cirrus SF50",
    seats: "4 seats",
    use: "Rotorua shuttle and Great Barrier routes",
  },
  {
    name: "HondaJet Elite",
    seats: "5 seats",
    use: "Chatham Islands and Lake Tekapo",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-sky-700">
            Dairy Flat Air
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Premium regional flight booking from Dairy Flat
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Book scheduled point-to-point light-jet services from Dairy Flat to
            Sydney, Rotorua, Great Barrier Island, Chatham Islands, and Lake
            Tekapo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/schedules"
              className="rounded-lg bg-sky-700 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-sky-800"
            >
              Search flights
            </Link>

            <Link
              href="/manage"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Manage booking
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {routes.map((route) => (
            <span
              key={route}
              className="rounded-md border border-sky-100 bg-white px-3 py-2 text-sm font-semibold text-sky-800 shadow-sm"
            >
              {route}
            </span>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
                Fleet
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Aircraft used across scheduled services
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-right">
              A small light-jet fleet supports premium international,
              weekday shuttle, island, and alpine routes from Dairy Flat.
            </p>
          </div>

          <div className="mt-5 divide-y divide-slate-200">
            {fleet.map((aircraft) => (
              <div
                key={aircraft.name}
                className="grid gap-2 py-4 md:grid-cols-[1.2fr_0.5fr_1fr] md:items-center"
              >
                <h3 className="font-semibold text-slate-950">
                  {aircraft.name}
                </h3>

                <p className="text-sm font-semibold text-sky-700">
                  {aircraft.seats}
                </p>

                <p className="text-sm text-slate-600">
                  {aircraft.use}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white/70 p-5 text-sm leading-6 text-slate-600">
          <span className="font-semibold text-slate-900">Network:</span>{" "}
          Dairy Flat Airport is the hub for scheduled services to Sydney,
          Rotorua, Great Barrier Island, Chatham Islands, and Lake Tekapo.
        </div>
      </section>
    </main>
  );
}