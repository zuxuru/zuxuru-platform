import { UsersRound } from 'lucide-react'

/** Shows the empty state for customer profiles until data is connected. */
export default function CustomerBuyingProfiler() {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted">
          <UsersRound className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">Understand your customers</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Buying patterns and customer profiles will appear here when customer or sales data is connected. No
            customer records are loaded in this workspace.
          </p>
        </div>
      </div>
      <div className="mt-7 overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 bg-muted px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Customer group</span>
          <span>Buying signals</span>
          <span>Next step</span>
        </div>
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          Connect customer data to create your first profile.
        </div>
      </div>
    </section>
  )
}
