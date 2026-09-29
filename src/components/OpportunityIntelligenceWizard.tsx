import { ArrowRight, Check, Circle, Target } from 'lucide-react'

const stages = [
  { label: 'Define your growth goal', complete: false },
  { label: 'Connect lead sources', complete: false },
  { label: 'Review and qualify opportunities', complete: false },
]

/** Shows the initial steps for setting up an opportunity pipeline. */
export default function OpportunityIntelligenceWizard() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <article className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <span className="grid size-11 place-items-center rounded-xl bg-muted">
          <Target className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Grow your opportunity pipeline</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Start by setting a measurable goal. Once lead sources are connected, opportunities can be organized for
          review and follow-up.
        </p>
        <label className="mt-5 block text-sm font-medium">
          What would you like to achieve?
          <input
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none transition focus:ring-2 focus:ring-ring"
            placeholder="For example, grow qualified leads"
          />
        </label>
        <button className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground" disabled>
          Connect a lead source
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </article>
      <aside className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-semibold">Opportunity setup</h2>
        <p className="mt-1 text-sm text-muted-foreground">Complete these steps to build a useful pipeline.</p>
        <ol className="mt-6 space-y-5">
          {stages.map(({ label, complete }) => (
            <li className="flex items-center gap-3 text-sm" key={label}>
              {complete ? (
                <Check className="size-5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Circle className="size-5 text-muted-foreground" aria-hidden="true" />
              )}
              {label}
            </li>
          ))}
        </ol>
      </aside>
    </section>
  )
}
