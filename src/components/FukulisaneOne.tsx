import { ArrowRight, Building2, MapPin, ScanSearch } from 'lucide-react'

const checklist = [
  'Add your business details',
  'Connect your online channels',
  'Review your visibility findings',
]

/** Shows setup steps for the business presence scan. */
export default function FukulisaneOne() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <article className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <span className="grid size-11 place-items-center rounded-xl bg-muted">
          <ScanSearch className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Start with your business profile</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Fukulisane can assess your digital presence after you provide business details and connect the channels you
          want included. No profile data has been added yet.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Business name
            <span className="mt-2 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-muted-foreground">
              <Building2 className="size-4 shrink-0" aria-hidden="true" />
              <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Your business" />
            </span>
          </label>
          <label className="text-sm font-medium">
            Location
            <span className="mt-2 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="City or region" />
            </span>
          </label>
        </div>
        <button className="mt-5 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground" disabled>
          Connect a data source to scan
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <p className="mt-2 text-xs text-muted-foreground">Scanning becomes available when a data connection is configured.</p>
      </article>

      <aside className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Your first scan</h2>
        <p className="mt-1 text-sm text-muted-foreground">A quick setup checklist to get started.</p>
        <ol className="mt-5 space-y-4">
          {checklist.map((item, index) => (
            <li className="flex items-start gap-3 text-sm" key={item}>
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <span className="pt-1">{item}</span>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  )
}
