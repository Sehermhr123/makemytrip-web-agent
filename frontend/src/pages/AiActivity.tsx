import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useModelCalls } from "../api/queries";

const NODES = ["planner", "completion", "recovery", "chat", "extraction_fallback"];
const PROVIDERS = ["gemini", "ollama"];

export default function AiActivity() {
  const [node, setNode] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const { data: calls } = useModelCalls({ node: node || undefined, provider: provider || undefined });

  return (
    <div className="mx-auto max-w-5xl px-8 py-7">
      <div className="mb-6 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Activity
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Every LLM call made by this platform, automatically logged - which node called it, what model,
          whether it succeeded or fell back to deterministic logic, and what it was grounded in.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <select
          value={node}
          onChange={(e) => setNode(e.target.value)}
          className="h-9 min-w-[190px] rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All nodes</option>
          {NODES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="h-9 min-w-[160px] rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All providers</option>
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {(calls ?? []).map((c) => (
          <Card
            key={c.id}
            className="border-border bg-background shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <span className="font-mono text-xs font-medium text-foreground">
                  {c.node}
                </span>

                <span className="text-xs text-muted-foreground">
                  {c.model_name}
                </span>

                {c.success ? (
                  <Badge variant="success">succeeded</Badge>
                ) : c.fallback_triggered ? (
                  <Badge variant="warning">fell back</Badge>
                ) : (
                  <Badge variant="destructive">failed</Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  {c.latency_ms}ms
                </span>

                {c.run_id && (
                  <Link
                    to={`/runs/${c.run_id}`}
                    className="ml-auto font-mono text-xs font-medium text-primary hover:underline"
                  >
                    Run {c.run_id.slice(0, 8)}
                  </Link>
                )}
              </div>

              <p className="mt-2 text-sm leading-5 text-foreground">
                {c.purpose}
              </p>

              {c.output_summary && (
                <p className="mt-1.5 truncate text-xs leading-5 text-muted-foreground">
                  {c.output_summary}
                </p>
              )}

              {c.error_message && (
                <p className="mt-1.5 truncate text-xs leading-5 text-destructive">
                  {c.error_message}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {(calls ?? []).length === 0 && (
          <Card className="border-border bg-background shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No AI model calls yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}