import { useState } from "react";
import { Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { useRunResults, useRunsByStates } from "../../api/queries";

export default function ExtractedDataQueue() {
  const { data: activeRuns } = useRunsByStates(["EXTRACTION", "VALIDATING_DATA", "SNAPSHOTTING"]);
  const { data: recentCompleted } = useRunsByStates(["COMPLETED", "REVIEW_REQUIRED"]);
  const candidates = [...(activeRuns ?? []), ...(recentCompleted ?? [])];
  const [selectedRunId, setSelectedRunId] = useState<string>("");

  const currentRunId = selectedRunId || candidates[0]?.id;
  const { data: results } = useRunResults(currentRunId);

  return (
    <div className="mx-auto max-w-5xl px-8 py-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Extracted Data
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Fields pulled from the most recent extraction, with confidence and validation flags.
        </p>
      </div>

      {candidates.length > 0 && (
        <select
          value={currentRunId}
          onChange={(e) => setSelectedRunId(e.target.value)}
          className="mb-4 h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {candidates.map((r) => (
            <option key={r.id} value={r.id}>
              Run {r.id.slice(0, 8)} - {r.state}
            </option>
          ))}
        </select>
      )}

      <div className="mt-1">
        {candidates.length === 0 && (
          <EmptyState
            icon={Database}
            title="No extracted data yet"
            description="This view shows the fields a run pulled from the target page once it reaches extraction. Nothing has extracted anything yet in this session."
          />
        )}

        {candidates.length > 0 && (results?.snapshots.length ?? 0) === 0 && (
          <EmptyState
            icon={Database}
            title="No fields extracted for this run"
            description="Extraction may still be in progress."
          />
        )}

        {(results?.snapshots ?? []).length > 0 && (
          <Card className="overflow-hidden rounded-lg border-border bg-background shadow-sm">
            <CardHeader className="border-b border-border px-5 py-4">
              <CardTitle className="flex items-center text-base font-semibold">
                Fields
                <Link
                  to={`/runs/${currentRunId}`}
                  className="ml-2 font-mono text-xs font-medium text-primary hover:underline"
                >
                  Run {currentRunId?.slice(0, 8)}
                </Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {(results?.snapshots ?? []).map((snap) => (
                    <tr
                      key={snap.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="w-1/4 px-5 py-3.5 align-top font-medium text-foreground">
                        {snap.entity_key}
                      </td>

                      <td className="px-5 py-3.5 text-xs leading-5 text-muted-foreground">
                        {Object.entries(snap.fields).map(([k, v]) => `${k}=${v}`).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}