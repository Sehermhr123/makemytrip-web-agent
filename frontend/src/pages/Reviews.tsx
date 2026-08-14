import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useDecideReview, useReviews } from "../api/queries";
import { getStoredUser } from "../lib/auth";

const ACTIONS = ["approve", "reject", "correct", "rerun", "request_schema_change"];
const REVIEWER_ROLES = ["reviewer", "operations_owner", "administrator"];

export default function Reviews() {
  const { data: reviews } = useReviews("pending");
  const decide = useDecideReview();
  const [reasonById, setReasonById] = useState<Record<string, string>>({});
  const user = getStoredUser();
  const canDecide = !!user && REVIEWER_ROLES.includes(user.role);

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Human review
      </h1>

      <div className="mt-6 space-y-4">
        {(reviews ?? []).map((r) => (
          <Card
            key={r.id}
            className="border-border bg-background shadow-sm"
          >
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/runs/${r.run_id}`}
                    className="font-mono text-xs font-medium text-primary hover:underline"
                  >
                    Run {r.run_id.slice(0, 8)}
                  </Link>

                  <Badge variant="warning">
                    {r.trigger_reason}
                  </Badge>
                </div>
              </div>

              {canDecide ? (
                <>
                  <input
                    value={reasonById[r.id] ?? ""}
                    onChange={(e) =>
                      setReasonById((prev) => ({
                        ...prev,
                        [r.id]: e.target.value,
                      }))
                    }
                    placeholder="Reason (optional)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
                  />

                  <div className="flex flex-wrap gap-2">
                    {ACTIONS.map((action) => (
                      <Button
                        key={action}
                        variant={
                          action === "approve"
                            ? "default"
                            : action === "reject"
                              ? "destructive"
                              : "outline"
                        }
                        disabled={decide.isPending}
                        onClick={() =>
                          decide.mutate({
                            reviewId: r.id,
                            action,
                            reason: reasonById[r.id],
                          })
                        }
                      >
                        {action.replace(/_/g, " ")}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
                  Only reviewers, operations owners, or administrators can decide reviews.
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {(reviews ?? []).length === 0 && (
          <Card className="border-border bg-background shadow-sm">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No pending reviews
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}