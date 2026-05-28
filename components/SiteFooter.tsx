export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h2 className="font-bold text-slate-900">Dairy Flat Air</h2>
            <p className="mt-2 text-sm text-slate-600">
              Premium regional flights from Dairy Flat to selected destinations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Destinations</h3>
            <p className="mt-2 text-sm text-slate-600">
              Sydney · Rotorua · Great Barrier Island · Chatham Islands · Lake
              Tekapo
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Booking support</h3>
            <p className="mt-2 text-sm text-slate-600">
              Use your booking reference to view invoices or cancel bookings.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}