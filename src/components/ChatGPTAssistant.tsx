import { useState, type FormEvent } from 'react'
import { Bot, LoaderCircle, Send } from 'lucide-react'

type ChatResponse = { text: string } | { error: string }

/** Sends a prompt to the locally hosted OpenAI Responses API integration. */
export default function ChatGPTAssistant() {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setAnswer('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      let result: unknown
      try {
        result = await response.json()
      } catch {
        throw new Error(`ChatGPT request failed (${response.status}).`)
      }
      if (typeof result !== 'object' || result === null) {
        throw new Error('The server returned an invalid response.')
      }

      const payload = result as ChatResponse
      if (!response.ok) {
        throw new Error('error' in payload ? payload.error : `ChatGPT request failed (${response.status}).`)
      }
      if (!('text' in payload) || typeof payload.text !== 'string') {
        throw new Error('The server response did not contain generated text.')
      }
      setAnswer(payload.text)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'ChatGPT request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8" aria-labelledby="chatgpt-title">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-muted">
          <Bot className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="chatgpt-title" className="font-semibold">ChatGPT assistant</h2>
          <p className="text-sm text-muted-foreground">Ask a question using your configured OpenAI API connection.</p>
        </div>
      </div>

      <form className="mt-5" onSubmit={submitPrompt}>
        <label htmlFor="chatgpt-prompt" className="text-sm font-medium">Your prompt</label>
        <textarea
          id="chatgpt-prompt"
          className="mt-2 min-h-28 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          maxLength={10_000}
          required
          placeholder="What would you like help with?"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Uses the server-side API key; it is never sent to the browser.</p>
          <button
            type="submit"
            disabled={loading || prompt.trim().length === 0}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
            {loading ? 'Thinking...' : 'Ask ChatGPT'}
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}
      {answer && (
        <div className="mt-5 rounded-xl bg-muted/60 p-4" aria-live="polite">
          <h3 className="text-sm font-semibold">Response</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{answer}</p>
        </div>
      )}
    </section>
  )
}
