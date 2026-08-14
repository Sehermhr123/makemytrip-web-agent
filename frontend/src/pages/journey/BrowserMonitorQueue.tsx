import { Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge, runStateVariant } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useRunEvidence, useRunsByStates } from "../../api/queries";

function BrowsingRow({ runId, state }: { runId: string; state: string }) {
  const { data: evidence } = useRunEvidence(runId, { refetchInterval: 3000 });
  const latest = evidence?.[evidence.length - 1];

  return (
    <Card className="rounded-lg border-border bg-background shadow-sm">
      <CardContent className="flex items-center gap-4 py-4">
        {latest?.screenshot_url ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}${latest.screenshot_url}`}
            alt="latest capture"
            className="h-16 w-28 shrink-0 rounded-md border border-border object-cover"
          />
        ) : (
          <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
            no capture yet
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/runs/${runId}`}
              className="font-mono text-sm font-medium text-primary hover:underline"
            >
              Run {runId.slice(0, 8)}
            </Link>

            <Badge variant={runStateVariant(state)}>{state}</Badge>
          </div>

          {latest && (
            <p className="mt-1.5 truncate text-xs text-muted-foreground">
              {latest.source_url}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BrowserMonitorQueue() {
  const { data: runs } = useRunsByStates([
    "QUEUED",
    "BROWSER_STARTING",
    "BROWSING",
    "RECOVERY",
  ]);

  return (
    <div className="mx-auto max-w-4xl px-8 py-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Browser Monitor
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Runs currently executing in the real browser worker, with their latest captured screenshot.
        </p>
      </div>

      <div className="space-y-3">
        {(runs ?? []).map((r) => (
          <BrowsingRow
            key={r.id}
            runId={r.id}
            state={r.state}
          />
        ))}

        {(runs ?? []).length === 0 && (
          <EmptyState
            icon={Radio}
            title="No active browser sessions right now"
            description="This queue fills while a run is browsing a target page. Start one from Task Intake to watch it move through here."
            action={
              <Link to="/tasks/new">
                <Button variant="outline">Go to Task Intake</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}