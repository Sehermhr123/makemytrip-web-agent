import { useState } from "react";
import { GitCompare } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge, significanceVariant } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { useChangeFeed } from "../../api/queries";

const WORKFLOWS = ["hotel_pricing_watch", "campaign_page_monitoring", "competitor_offer_tracking", "partner_update_review", "travel_trend_scanning"];
const SIGNIFICANCE = ["insignificant", "minor", "notable", "significant"];

export default function ComparisonFeed() {
  const [workflow, setWorkflow] = useState("");
  const [significance, setSignificance] = useState("");
  const { data: changes } = useChangeFeed({
    workflow_type: workflow || undefined,
    significance: significance || undefined,
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-7">
      <div className="mb-6 border-b border-border/70 pb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Comparison
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Comparison
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          A live feed of detected changes across every run - deterministic diffs, never LLM-computed.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={workflow}
          onChange={(e) => setWorkflow(e.target.value)}
          className="h-9 min-w-[220px] rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All workflows</option>
          {WORKFLOWS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <select
          value={significance}
          onChange={(e) => setSignificance(e.target.value)}
          className="h-9 min-w-[170px] rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">All significance</option>
          {SIGNIFICANCE.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {(changes ?? []).map((c) => (
          <Card
            key={c.id}
            className="border-border bg-background shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <span className="font-medium text-foreground">
                  {c.entity_name}
                </span>

                <span className="font-mono text-xs text-muted-foreground">
                  {c.change_type}
                </span>

                <Badge variant={significanceVariant(c.significance)}>
                  {c.significance}
                </Badge>

                <Link
                  to={`/runs/${c.run_id}`}
                  className="ml-auto font-mono text-xs font-medium text-primary hover:underline"
                >
                  Run {c.run_id.slice(0, 8)}
                </Link>
              </div>

              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                {c.previous_value ?? "-"} to {c.current_value ?? "-"}
                {c.delta_pct != null ? ` (${c.delta_pct}%)` : ""}
              </p>
            </CardContent>
          </Card>
        ))}

        {(changes ?? []).length === 0 && (
          <EmptyState
            icon={GitCompare}
            title="No comparisons yet"
            description="Changes appear here once a run has both a current and a prior snapshot to diff against."
          />
        )}
      </div>
    </div>
  );
}