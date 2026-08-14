import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useHealth } from "../api/queries";

export default function SystemHealth() {
  const { data } = useHealth();

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <div className="mb-6 border-b border-border/70 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">System health</h1>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/70 px-5 py-4">
          <CardTitle className="text-base font-semibold">Services</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {data && Object.entries(data.services).map(([name, status]) => (
            <div
              key={name}
              className="flex items-center justify-between border-b border-border px-5 py-3.5 text-sm last:border-0 hover:bg-secondary/30"
            >
              <span className="font-mono text-xs font-medium">{name}</span>

              <Badge
                variant={status === "healthy" ? "success" : "destructive"}
              >
                {status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}