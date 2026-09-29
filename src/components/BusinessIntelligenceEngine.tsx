import { Activity, Compass, ShieldCheck } from 'lucide-react'

const areas = [
  { icon: Compass, title: 'Strategy', text: 'Set a business goal and focus the next set of recommendations.' },
  { icon: Activity, title: 'Business health', text: 'Review operating signals after connecting your business data.' },
  { icon: ShieldCheck, title: 'Risks', text: 'Surface risks for review before taking action.' },
]

/** Shows the strategy, business-health, and risk setup areas. */
export default function BusinessIntelligenceEngine() {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">Business intelligence</p>
        <h2 className="mt-2 text-xl font-semibold">Build a clear picture before making your next move.</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Strategy and health indicators will be based on your connected business information. Connect a data source to
          begin; this workspace currently has no business data.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {areas.map(({ icon: Icon, title, text }) => (
          <article className="rounded-xl border border-border p-5" key={title}>
            <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
