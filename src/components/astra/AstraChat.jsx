import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askAstra } from "@/lib/server-fns";
import { cn } from "@/lib/utils";

export default function AstraChat({ mode = "general", context = "", suggestions = [], compact = false }) {
  const ask = useServerFn(askAstra);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function send(text) {
    const prompt = (text ?? input).trim();
    if (!prompt || busy) return;
    setMessages((all) => [...all, { role: "user", text: prompt }]);
    setInput("");
    setBusy(true);
    try {
      const res = await ask({ data: { prompt, mode, context } });
      setMessages((all) => [...all, { role: "astra", text: res.answer || "I have no answer for that yet." }]);
    } catch {
      setMessages((all) => [
        ...all,
        { role: "astra", text: "I can't reach the instructor channel right now. Please try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={cn("min-h-0 flex-1 space-y-3 overflow-y-auto pr-1", compact ? "max-h-[320px]" : "max-h-[460px]")}>
        {messages.length === 0 && (
          <div className="rounded-xl border border-border/70 bg-background/40 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> ASTRA · AI Instructor
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Ask about the science behind what you see, or request a hint. Hints guide your reasoning — they
              won't hand you the answer during an active assessment.
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "rounded-xl px-3 py-2 text-xs leading-relaxed",
              message.role === "user"
                ? "ml-6 bg-primary/15 text-foreground"
                : "mr-2 border border-border/60 bg-card/70 text-muted-foreground",
            )}
          >
            {message.role === "astra" && (
              <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Bot className="h-3 w-3" /> ASTRA
              </span>
            )}
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
        ))}
        {busy && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> ASTRA is analysing…
          </p>
        )}
        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => send(suggestion)}
              className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="mt-3 flex items-end gap-2"
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder="Ask ASTRA a question…"
          className="min-h-[52px] resize-none text-xs"
        />
        <Button type="submit" size="icon" disabled={busy || !input.trim()} className="h-[52px] w-12 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}