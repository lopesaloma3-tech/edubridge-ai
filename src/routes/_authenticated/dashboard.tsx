import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader, Panel, ProgressBar, StatCard } from "@/components/app/panels";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getAccessibleCourses,
  getResultsForUser,
  type AssessmentResult,
} from "@/lib/supabase/academic";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | EduBridge" },
      {
        name: "description",
        content:
          "Your personalised campus overview: attendance, grades, courses and upcoming work.",
      },
      { property: "og:title", content: "Dashboard | EduBridge" },
      {
        property: "og:description",
        content:
          "Your personalised campus overview: attendance, grades, courses and upcoming work.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { role, name, user } = useCurrentUser();

  const coursesQuery = useQuery({
    queryKey: ["dashboard-courses", user?.id, role],
    enabled: !!user,
    queryFn: () => getAccessibleCourses(user!.id, role),
  });

  const resultsQuery = useQuery({
    queryKey: ["dashboard-results", user?.id, role],
    enabled: !!user,
    queryFn: () => getResultsForUser(user!.id, role),
  });

  const attendanceQuery = useQuery({
    queryKey: ["dashboard-attendance", user?.id, role],
    enabled: !!user,
    queryFn: async () => {
      if (role === "teacher") {
        const { data, error } = await supabase
          .from("attendance_sessions")
          .select("id")
          .eq("marked_by", user!.id);
        if (error) throw error;
        return { totalSessions: data?.length ?? 0 };
      }

      const { data, error } = await supabase
        .from("attendance_records")
        .select("status")
        .eq("student_user_id", user!.id);
      if (error) throw error;
      return { records: data ?? [] };
    },
  });

  const assignmentsQuery = useQuery({
    queryKey: ["dashboard-assignments", user?.id, role],
    enabled: !!user,
    queryFn: async () => {
      const courseIds = (coursesQuery.data ?? []).map((course) => course.id);
      if (courseIds.length === 0) return [];

      const { data, error } = await supabase
        .from("assignments")
        .select("id, title, due_at, status, course_id")
        .in("course_id", courseIds)
        .order("due_at", { ascending: true })
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  const invoicesQuery = useQuery({
    queryKey: ["dashboard-invoices", user?.id],
    enabled: !!user && (role === "student" || role === "parent" || role === "admin"),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_invoices")
        .select("amount, status, due_date")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const courses = coursesQuery.data ?? [];
  const results = resultsQuery.data ?? [];
  const assignments = assignmentsQuery.data ?? [];
  const averageScore = results.length
    ? Math.round(
        results.reduce((sum, item: AssessmentResult) => sum + Number(item.score || 0), 0) /
          results.length,
      )
    : 0;

  const attendanceRate = (() => {
    if (role === "teacher") return null;
    const records =
      (attendanceQuery.data as { records?: Array<{ status: string }> } | undefined)?.records ?? [];
    if (records.length === 0) return 0;
    const positive = records.filter((record) =>
      ["present", "late", "excused"].includes(record.status),
    ).length;
    return Math.round((positive / records.length) * 100);
  })();

  const outstandingFees = (invoicesQuery.data ?? [])
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const statsByRole = {
    student: [
      {
        label: "Attendance",
        value: `${attendanceRate ?? 0}%`,
        hint: "Across recorded sessions",
        icon: CalendarCheck,
      },
      {
        label: "Average score",
        value: `${averageScore}%`,
        hint: "Published assessments",
        icon: Trophy,
      },
      {
        label: "Active courses",
        value: String(courses.length),
        hint: "Current enrollments",
        icon: BookOpen,
      },
      {
        label: "Open assignments",
        value: String(assignments.length),
        hint: "Upcoming work",
        icon: ClipboardList,
      },
    ],
    teacher: [
      { label: "My classes", value: String(courses.length), hint: "Assigned courses", icon: Users },
      {
        label: "Assignments",
        value: String(assignments.length),
        hint: "Tracked in workspace",
        icon: ClipboardList,
      },
      {
        label: "Attendance sessions",
        value: String(
          (attendanceQuery.data as { totalSessions?: number } | undefined)?.totalSessions ?? 0,
        ),
        hint: "Registers created",
        icon: CalendarCheck,
      },
      {
        label: "Results published",
        value: String(results.length),
        hint: "Assessment records",
        icon: Trophy,
      },
    ],
    parent: [
      {
        label: "Linked courses",
        value: String(courses.length),
        hint: "Children's active classes",
        icon: Users,
      },
      {
        label: "Attendance",
        value: `${attendanceRate ?? 0}%`,
        hint: "Combined visible records",
        icon: CalendarCheck,
      },
      {
        label: "Outstanding fees",
        value: `$${outstandingFees.toLocaleString()}`,
        hint: "Visible invoices",
        icon: Wallet,
      },
      {
        label: "Published results",
        value: String(results.length),
        hint: "Assessment records",
        icon: Trophy,
      },
    ],
    admin: [
      {
        label: "Courses",
        value: String(courses.length),
        hint: "Visible academic workspaces",
        icon: BookOpen,
      },
      { label: "Results", value: String(results.length), hint: "Published records", icon: Trophy },
      {
        label: "Invoices",
        value: String((invoicesQuery.data ?? []).length),
        hint: "Fee records",
        icon: CreditCard,
      },
      {
        label: "Assignments",
        value: String(assignments.length),
        hint: "Current academic workload",
        icon: ClipboardList,
      },
    ],
    super_admin: [
      {
        label: "Courses",
        value: String(courses.length),
        hint: "Visible academic workspaces",
        icon: BookOpen,
      },
      { label: "Results", value: String(results.length), hint: "Published records", icon: Trophy },
      { label: "Users", value: name ? "1" : "0", hint: "Current session ready", icon: Users },
      {
        label: "Assignments",
        value: String(assignments.length),
        hint: "Current academic workload",
        icon: ClipboardList,
      },
    ],
  } as const;

  const stats = statsByRole[role];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Good day${name ? `, ${name.split(" ")[0]}` : ""}`}
        subtitle="Here's what's happening across your campus today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title={role === "teacher" ? "My classes" : "Courses"}
          description="Live progress from the academic workspace"
        >
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{course.teacherName}</p>
                  </div>
                  <span className="text-xs font-semibold">{course.progressPercent}%</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={course.progressPercent} />
                </div>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="text-sm text-muted-foreground">No active courses yet.</li>
            )}
          </ul>
        </Panel>

        <Panel
          title={role === "teacher" ? "Recent assessments" : "Upcoming work"}
          description="Recent academic activity"
        >
          <ul className="divide-y divide-border">
            {(role === "teacher" ? results.slice(0, 6) : assignments).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.title ?? item.assessments?.title ?? "Item"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.due_at
                      ? `Due ${new Date(item.due_at).toLocaleDateString()}`
                      : item.published_at
                        ? `Published ${new Date(item.published_at).toLocaleDateString()}`
                        : "Recorded"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs capitalize">
                  {item.status ?? item.grade ?? "Open"}
                </span>
              </li>
            ))}
            {(role === "teacher" ? results.length === 0 : assignments.length === 0) && (
              <li className="py-3 text-sm text-muted-foreground">No recent activity yet.</li>
            )}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
