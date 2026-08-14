import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ChatTranscript, useChatController } from "../components/AssistantWidget";

export default function Assistant() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isPending } = useChatController();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input;
    setInput("");
    sendMessage(text);
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ask MMT Assistant
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Questions are answered from real monitored data when available. Every reply says which mode it used.
        </p>
      </div>

      <Card className="border-border bg-background shadow-sm">
        <CardHeader className="border-b border-border/70 px-5 py-4">
          <CardTitle className="text-base font-semibold">
            Transcript
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 py-5">
          <div className="min-h-[300px]">
            {messages.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No messages yet. Ask about a destination or signal.
                </p>
              </div>
            ) : (
              <ChatTranscript messages={messages} />
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex gap-2 border-t border-border/70 pt-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
              disabled={isPending}
            />

            <button
              type="submit"
              disabled={isPending || !input.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}