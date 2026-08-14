import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useFailures } from "../api/queries";

export default function Failures() {
  const { data: failures } = useFailures();

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Failures and recovery
        </h1>
      </div>

      <div className="space-y-4">
        {(failures ?? []).map((f) => (
          <Card
            key={f.id}
            className="border-border bg-background shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
                <Badge variant="destructive">
                  {f.error_type}
                </Badge>

                <Badge
                  variant={f.recovery_state === "recovered" ? "success" : "outline"}
                >
                  {f.recovery_state}
                </Badge>

                <Link
                  to={`/runs/${f.run_id}`}
                  className="ml-auto font-mono text-xs font-medium text-primary hover:underline"
                >
                  Run {f.run_id.slice(0, 8)}
                </Link>
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {f.message}
              </p>

              {f.recovery_attempts.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-border/70 pt-3 text-xs">
                  {f.recovery_attempts.map((a, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-2"
                    >
                      <span className="font-mono text-muted-foreground">
                        {a.candidate_selector}
                      </span>

                      <Badge
                        variant={a.result === "validated" ? "success" : "outline"}
                      >
                        {a.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {(failures ?? []).length === 0 && (
          <Card className="border-border bg-background shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No failures recorded
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}