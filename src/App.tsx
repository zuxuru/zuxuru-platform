import { BrainCircuit, CircleHelp, Sparkles } from 'lucide-react'
import IntelligenceHub from '@/components/IntelligenceHub'

/** Renders the Fukulisane business-growth workspace shell. */
export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a className="flex items-center gap-3" href="/" aria-label="Zuxuru Platform home">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BrainCircuit className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">Fukulisane</span>
              <span className="block text-xs text-muted-foreground">Business growth workspace</span>
            </span>
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            href="https://github.com/zuxuru/zuxuru-platform"
            target="_blank"
            rel="noreferrer"
          >
            <CircleHelp className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Help</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="mb-9 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your business growth workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn business insight into action.</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Explore your digital presence, business health, customer behavior, and opportunities from one workspace.
            Connect your business data to unlock tailored insights.
          </p>
        </section>
        <IntelligenceHub />
      </div>
    </main>
  )
}
