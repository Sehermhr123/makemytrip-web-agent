import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useApproveRun, usePlan, useRejectRun, useRunsByStates } from "../../api/queries";

function PlanRow({ runId, planId }: { runId: string; planId: string | null }) {
  const [expanded, setExpanded] = useState(false);
  const { data: plan } = usePlan(expanded ? planId : null);
  const approve = useApproveRun();
  const reject = useRejectRun();

  return (
    <Card className="rounded-lg border-border bg-background shadow-sm">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/runs/${runId}`}
            className="font-mono text-sm font-medium text-primary hover:underline"
          >
            Run {runId.slice(0, 8)}
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 px-3 text-xs font-medium"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Hide plan" : "View plan"}
            </Button>

            <Button
              className="h-8 px-3 text-xs font-medium"
              onClick={() => approve.mutate(runId)}
              disabled={approve.isPending}
            >
              Approve
            </Button>

            <Button
              variant="destructive"
              className="h-8 px-3 text-xs font-medium"
              onClick={() => reject.mutate({ runId })}
              disabled={reject.isPending}
            >
              Reject
            </Button>
          </div>
        </div>

        {expanded && plan && (
          <div className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
            <div>
              <p className="mb-1 font-medium text-foreground">Objective</p>
              <p className="leading-6 text-muted-foreground">
                {plan.objective}
              </p>
            </div>

            {plan.risk_notes && (
              <div>
                <p className="mb-1 font-medium text-foreground">Risk notes</p>
                <p className="leading-6 text-muted-foreground">
                  {plan.risk_notes}
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 font-medium text-foreground">Steps</p>
              <ol className="ml-5 list-decimal space-y-1.5 text-muted-foreground">
                {plan.steps.map((s) => (
                  <li key={s.step_order}>
                    {s.action} - {s.target}
                    {s.notes ? ` (${s.notes})` : ""}
                  </li>
                ))}
              </ol>
            </div>

            {plan.stop_conditions.length > 0 && (
              <div>
                <p className="mb-2 font-medium text-foreground">
                  Stop conditions
                </p>
                <ul className="ml-5 list-disc space-y-1.5 text-muted-foreground">
                  {plan.stop_conditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PlanReviewQueue() {
  const { data: runs } = useRunsByStates(["AWAITING_APPROVAL"]);

  return (
    <div className="mx-auto max-w-4xl px-8 py-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Plan Review
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Runs waiting for a plan to be approved before browsing starts.
        </p>
      </div>

      <div className="space-y-3">
        {(runs ?? []).map((r) => (
          <PlanRow key={r.id} runId={r.id} planId={r.plan_id} />
        ))}

        {(runs ?? []).length === 0 && (
          <EmptyState
            icon={ClipboardList}
            title="No plans currently awaiting review"
            description="Runs land here only when their task requires approval before browsing. Start a new task from Task Intake to see one move through the pipeline."
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