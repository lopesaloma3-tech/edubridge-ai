import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getAccessibleCourses,
  getAttendanceForUser,
  getRegisterForCourse,
  saveAttendanceRegister,
  type AttendanceHistoryRecord,
} from "@/lib/supabase/academic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance | EduBridge" },
      {
        name: "description",
        content: "Monitor presence rates and mark the daily register across classes.",
      },
      { property: "og:title", content: "Attendance | EduBridge" },
      {
        property: "og:description",
        content: "Monitor presence rates and mark the daily register across classes.",
      },
    ],
  }),
  component: Attendance,
});

function Attendance() {
  const queryClient = useQueryClient();
  const { role, user } = useCurrentUser();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [marks, setMarks] = useState<Record<string, "present" | "absent" | "late" | "excused">>({});

  const { data: teacherCourses = [] } = useQuery({
    queryKey: ["attendance-courses", user?.id, role],
    enabled: !!user && role === "teacher",
    queryFn: () => getAccessibleCourses(user!.id, role),
  });

  useEffect(() => {
    if (!selectedCourseId && teacherCourses.length > 0) {
      setSelectedCourseId(teacherCourses[0].id);
    }
  }, [teacherCourses, selectedCourseId]);

  const attendanceQuery = useQuery({
    queryKey: ["attendance-summary", user?.id, role],
    enabled: !!user,
    queryFn: () => getAttendanceForUser(user!.id, role),
  });

  const registerQuery = useQuery({
    queryKey: ["attendance-register", selectedCourseId, today],
    enabled: !!selectedCourseId && role === "teacher",
    queryFn: () => getRegisterForCourse(selectedCourseId, today),
  });

  useEffect(() => {
    if (!registerQuery.data?.roster) return;
    const nextMarks: Record<string, "present" | "absent" | "late" | "excused"> = {};
    registerQuery.data.roster.forEach((student) => {
      if (student.status)
        nextMarks[student.userId] = student.status as "present" | "absent" | "late" | "excused";
    });
    setMarks(nextMarks);
  }, [registerQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedCourseId) return;
      await saveAttendanceRegister(selectedCourseId, user.id, today, marks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-register", selectedCourseId, today] });
      toast.success("Register saved successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (role === "teacher") {
    const roster = registerQuery.data?.roster ?? [];
    const summary = {
      present: Object.values(marks).filter((status) => status === "present").length,
      absent: Object.values(marks).filter((status) => status === "absent").length,
      late: Object.values(marks).filter((status) => status === "late").length,
      excused: Object.values(marks).filter((status) => status === "excused").length,
    };

    return (
      <div className="animate-fade-in space-y-4">
        <PageHeader
          title="Attendance"
          subtitle="Mark the daily register and monitor class attendance."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel
            title="Today's register"
            description="Select a course and record attendance"
            className="lg:col-span-2"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {teacherCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(course.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm transition-all",
                    selectedCourseId === course.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {course.code}
                </button>
              ))}
            </div>

            <ul className="divide-y divide-border">
              {roster.map((student) => (
                <li
                  key={student.userId}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">{student.email ?? "No email"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["present", "late", "excused", "absent"] as const).map((state) => (
                      <button
                        key={state}
                        onClick={() =>
                          setMarks((current) => ({ ...current, [student.userId]: state }))
                        }
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                          marks[student.userId] === state
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <Button
              variant="hero"
              className="mt-4"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !selectedCourseId}
            >
              Save register
            </Button>
          </Panel>

          <Panel title="Summary" description={today}>
            <dl className="space-y-4 text-sm">
              {Object.entries(summary).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <dt className="capitalize text-muted-foreground">{key}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    );
  }

  const records: AttendanceHistoryRecord[] =
    attendanceQuery.data && "records" in attendanceQuery.data
      ? (attendanceQuery.data.records ?? [])
      : [];
  const stats = records.reduce(
    (acc, record: AttendanceHistoryRecord) => {
      acc.total += 1;
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, present: 0, absent: 0, late: 0, excused: 0 } as Record<string, number>,
  );
  const rate = stats.total
    ? Math.round(((stats.present + stats.late + stats.excused) / stats.total) * 100)
    : 0;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader title="Attendance" subtitle="Your attendance history across enrolled courses." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Summary" className="lg:col-span-1">
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Overall rate</dt>
              <dd className="font-semibold">{rate}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Present</dt>
              <dd className="font-semibold">{stats.present}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Late</dt>
              <dd className="font-semibold">{stats.late}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Absent</dt>
              <dd className="font-semibold">{stats.absent}</dd>
            </div>
          </dl>
        </Panel>

        <Panel
          title="Attendance history"
          description="Most recent sessions"
          className="lg:col-span-2"
        >
          <ul className="divide-y divide-border">
            {records.map((record: AttendanceHistoryRecord) => (
              <li key={record.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">
                    {record.attendance_sessions?.courses?.title ?? "Course"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {record.attendance_sessions?.session_date ?? "No date"}
                    {record.attendance_sessions?.topic
                      ? ` · ${record.attendance_sessions.topic}`
                      : ""}
                  </p>
                </div>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs capitalize">
                  {record.status}
                </span>
              </li>
            ))}
            {records.length === 0 && (
              <li className="py-6 text-sm text-muted-foreground">No attendance records yet.</li>
            )}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
