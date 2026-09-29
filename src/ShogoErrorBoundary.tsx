import { Component, type ErrorInfo, type ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

/** Keeps rendering failures inside the app from leaving a blank page. */
export class ShogoErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application rendering failed', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
          <section className="max-w-md text-center">
            <CircleAlert className="mx-auto size-10 text-red-600" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-semibold">This page couldn’t load</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while displaying the workspace. Reload the page to try again.
            </p>
            <button
              className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={() => window.location.reload()}
              type="button"
            >
              Reload page
            </button>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}
