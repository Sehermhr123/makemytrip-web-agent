import { FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useBulkArchiveRuns } from "../api/queries";
import { getStoredUser } from "../lib/auth";

// admin-only lifecycle controls for Runs (Phase 37.2) - deliberately limited
// to soft archival, never a raw delete-all. The engineering guidelines forbid a "Clear Runs"
// button that removes rows; --reset-data in run-local.sh already covers the
// "wipe everything for a fresh demo" case at the Docker-volume level.
export default function DataManagement() {
  const user = getStoredUser();
  const isAdmin = user?.role === "administrator";

  const [olderThanDays, setOlderThanDays] = useState(30);
  const [state, setState] = useState("COMPLETED");
  const [result, setResult] = useState<{ count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bulkArchive = useBulkArchiveRuns();

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="border-b border-border/70 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Data Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Only administrators can access run lifecycle controls.
          </p>
        </div>
      </div>
    );
  }

  async function handleBulkArchive(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const res = await bulkArchive.mutateAsync({ older_than_days: olderThanDays, state });
      setResult({ count: res.count });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk archive failed.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <div className="mb-6 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Data Management
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Archiving hides old runs from default list views without deleting anything - every archived
          run stays fully retrievable with its complete evidence chain intact. Raw screenshots/HTML in
          MinIO are separately purged by the retention scheduler once they age past the configured
          retention window; the underlying Evidence metadata is never removed.
        </p>
      </div>

      <Card className="overflow-hidden border-border bg-background shadow-sm">
        <CardHeader className="border-b border-border/70 px-5 py-4">
          <CardTitle className="text-base font-semibold">
            Bulk archive completed runs
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 py-5">
          <form onSubmit={handleBulkArchive} className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground md:col-span-1">
              Older than (days)
              <input
                type="number"
                min={1}
                value={olderThanDays}
                onChange={(e) => setOlderThanDays(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground md:col-span-1">
              Run state
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>

            <div className="flex items-end md:col-span-1">
              <Button
                type="submit"
                disabled={bulkArchive.isPending}
                className="h-9 w-full"
              >
                {bulkArchive.isPending ? "Archiving" : "Archive matching runs"}
              </Button>
            </div>
          </form>

          {result && (
            <p className="mt-4 border-t border-border/70 pt-4 text-sm text-muted-foreground">
              Archived {result.count} run{result.count === 1 ? "" : "s"}.
            </p>
          )}

          {error && (
            <p className="mt-4 border-t border-border/70 pt-4 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}