import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useSources } from "../api/queries";

const HEALTH_VARIANT = {
  HEALTHY: "success",
  DEGRADED: "warning",
  UNSTABLE: "warning",
  FAILED: "destructive",
  REVIEW_REQUIRED: "destructive",
} as const;

export default function SourceHealth() {
  const { data: sources } = useSources();

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Source health
        </h1>
      </div>

      <Card className="overflow-hidden border-border bg-background shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Domain</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Runs</th>
                  <th className="px-3 py-3 text-right">Failures</th>
                  <th className="px-5 py-3 text-right">Consecutive</th>
                </tr>
              </thead>

              <tbody>
                {(sources ?? []).map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-foreground">
                      {s.domain}
                    </td>

                    <td className="px-3 py-3.5 text-xs text-muted-foreground">
                      {s.category}
                    </td>

                    <td className="px-3 py-3.5">
                      <Badge variant={HEALTH_VARIANT[s.health_state]}>
                        {s.health_state}
                      </Badge>
                    </td>

                    <td className="px-3 py-3.5 text-right tabular-nums">
                      {s.total_runs}
                    </td>

                    <td className="px-3 py-3.5 text-right tabular-nums">
                      {s.total_failures}
                    </td>

                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {s.consecutive_failures}
                    </td>
                  </tr>
                ))}

                {(sources ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      No sources registered
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}