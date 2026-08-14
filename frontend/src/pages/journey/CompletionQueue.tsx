import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { downloadFile } from "../../api/client";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useRunResults, useRunsByStates } from "../../api/queries";

function CompletionRow({ runId }: { runId: string }) {
  const { data: results } = useRunResults(runId);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadReport() {
    setDownloading(true);
    try {
      await downloadFile(`/api/runs/${runId}/report.pdf`, `run-${runId}-report.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Card className="border-border bg-background shadow-sm">
      <CardContent className="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/runs/${runId}`}
            className="font-mono text-sm font-medium text-primary hover:underline"
          >
            Run {runId.slice(0, 8)}
          </Link>

          <Button
            variant="outline"
            className="h-8 px-3 text-xs font-medium shadow-none"
            onClick={handleDownloadReport}
            disabled={downloading}
          >
            {downloading ? "Preparing report" : "Download Report (PDF)"}
          </Button>
        </div>

        {results?.summary && (
          <p className="mt-3 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground">
            {results.summary.headline}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompletionQueue() {
  const { data: runs } = useRunsByStates(["COMPLETED"]);

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="mb-6 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Completion
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Runs that finished the full pipeline, with their generated summary.
        </p>
      </div>

      <div className="space-y-3">
        {(runs ?? []).map((r) => (
          <CompletionRow key={r.id} runId={r.id} />
        ))}

        {(runs ?? []).length === 0 && (
          <EmptyState
            icon={CheckCircle2}
            title="No completed runs yet"
            description="Runs appear here once they finish the full pipeline end to end."
          />
        )}
      </div>
    </div>
  );
}