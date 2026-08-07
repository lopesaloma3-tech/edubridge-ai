import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Panel, ProgressBar } from "@/components/app/panels";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getResultsForUser, type AssessmentResult } from "@/lib/supabase/academic";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({
    meta: [
      { title: "Results | EduBridge" },
      {
        name: "description",
        content: "Term-by-term academic performance with subject-level breakdowns.",
      },
      { property: "og:title", content: "Results | EduBridge" },
      {
        property: "og:description",
        content: "Term-by-term academic performance with subject-level breakdowns.",
      },
    ],
  }),
  component: Results,
});

function Results() {
  const { user, role } = useCurrentUser();
  const { data = [], isLoading } = useQuery({
    queryKey: ["results", user?.id, role],
    enabled: !!user,
    queryFn: () => getResultsForUser(user!.id, role),
  });

  const avg = data.length
    ? Math.round(
        data.reduce((sum: number, item: AssessmentResult) => sum + Number(item.score || 0), 0) /
          data.length,
      )
    : 0;
  const publishedCount = data.filter((item: AssessmentResult) => item.published_at).length;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Results"
        subtitle="Assessment outcomes and academic performance from live records."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Performance summary" className="lg:col-span-1">
          <p className="text-4xl font-semibold tracking-tight">{avg}%</p>
          <p className="mt-1 text-sm text-muted-foreground">Average across published assessments</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assessments</span>
              <span className="font-semibold">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Published</span>
              <span className="font-semibold">{publishedCount}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Assessment breakdown" className="lg:col-span-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading results...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-2 font-medium">Assessment</th>
                    <th className="py-2 font-medium">Course</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Score</th>
                    <th className="py-2 font-medium">Grade</th>
                    <th className="w-40 py-2 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((result: AssessmentResult) => {
                    const maxScore = Number(result.assessments?.max_score ?? 100) || 100;
                    const percentage = Math.min(
                      100,
                      Math.round((Number(result.score || 0) / maxScore) * 100),
                    );
                    return (
                      <tr key={result.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3 font-medium">
                          {result.assessments?.title ?? "Assessment"}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {result.assessments?.courses?.title ?? "Course"}
                        </td>
                        <td className="py-3 capitalize">
                          {String(result.assessments?.assessment_type ?? "other").replace("_", " ")}
                        </td>
                        <td className="py-3">
                          {result.score} / {maxScore}
                        </td>
                        <td className="py-3 font-semibold">{result.grade ?? "—"}</td>
                        <td className="py-3">
                          <ProgressBar value={percentage} />
                        </td>
                      </tr>
                    );
                  })}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                        No results have been published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
