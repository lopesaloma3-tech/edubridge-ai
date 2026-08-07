import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, FileText, Megaphone, Search, Sparkles, Users } from "lucide-react";
import { PageHeader, Panel, ProgressBar, StatCard } from "@/components/app/panels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getAccessibleCourses,
  getCourseAnnouncements,
  getCourseAssignments,
  getCourseMaterials,
  getCourseQuizzes,
  postCourseAnnouncement,
} from "@/lib/supabase/academic";

import type { AssessmentResult } from "@/lib/supabase/academic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses")({
  head: () => ({
    meta: [
      { title: "Courses | EduBridge" },
      {
        name: "description",
        content:
          "Manage courses, study materials, assessments and class updates from one academic workspace.",
      },
      { property: "og:title", content: "Courses | EduBridge" },
      {
        property: "og:description",
        content:
          "Manage courses, study materials, assessments and class updates from one academic workspace.",
      },
    ],
  }),
  component: Courses,
});

function Courses() {
  const queryClient = useQueryClient();
  const { role, user } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const coursesQuery = useQuery({
    queryKey: ["courses-workspace", user?.id, role],
    enabled: !!user,
    queryFn: () => getAccessibleCourses(user!.id, role),
  });

  const filteredCourses = useMemo(() => {
    const term = query.trim().toLowerCase();
    const courses = coursesQuery.data ?? [];
    if (!term) return courses;
    return courses.filter((course) =>
      [course.title, course.code, course.teacherName, course.departmentName].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [coursesQuery.data, query]);

  useEffect(() => {
    if (!selectedCourseId && filteredCourses[0]?.id) {
      setSelectedCourseId(filteredCourses[0].id);
    }
  }, [filteredCourses, selectedCourseId]);

  const selectedCourse =
    filteredCourses.find((course) => course.id === selectedCourseId) ?? filteredCourses[0];

  const materialsQuery = useQuery({
    queryKey: ["course-materials", selectedCourse?.id],
    enabled: !!selectedCourse?.id,
    queryFn: () => getCourseMaterials(selectedCourse!.id),
  });

  const assignmentsQuery = useQuery({
    queryKey: ["course-assignments", selectedCourse?.id, user?.id, role],
    enabled: !!selectedCourse?.id && !!user,
    queryFn: () => getCourseAssignments(selectedCourse!.id, user!.id, role),
  });

  const quizzesQuery = useQuery({
    queryKey: ["course-quizzes", selectedCourse?.id, user?.id, role],
    enabled: !!selectedCourse?.id && !!user,
    queryFn: () => getCourseQuizzes(selectedCourse!.id, user!.id, role),
  });

  const announcementsQuery = useQuery({
    queryKey: ["course-announcements", selectedCourse?.id],
    enabled: !!selectedCourse?.id,
    queryFn: () => getCourseAnnouncements(selectedCourse!.id),
  });

  const postAnnouncementMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCourse?.id || !user || !announcement.trim()) return;
      const title =
        announcement
          .trim()
          .split(/[.!?\n]/)[0]
          .slice(0, 80) || "Course update";
      await postCourseAnnouncement(selectedCourse.id, user.id, title, announcement.trim());
    },
    onSuccess: () => {
      setAnnouncement("");
      queryClient.invalidateQueries({ queryKey: ["course-announcements", selectedCourse?.id] });
      toast.success("Announcement posted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const courseCount = filteredCourses.length;
  const materialCount = (materialsQuery.data ?? []).length;
  const assignmentCount = (assignmentsQuery.data ?? []).length;
  const announcementCount = (announcementsQuery.data ?? []).length;

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Academic workspace"
        subtitle={
          role === "teacher"
            ? "Manage class content, assignments, quizzes and announcements in one place."
            : role === "admin" || role === "super_admin"
              ? "Oversee course delivery and academic operations across the institution."
              : "Access study materials, track submissions and stay aligned with every class."
        }
        action={
          role === "student" || role === "parent" ? (
            <Button variant="hero" disabled>
              <Sparkles className="h-4 w-4" /> AI plan from live data
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Courses"
          value={String(courseCount)}
          hint="Accessible workspaces"
          icon={BookOpen}
        />
        <StatCard
          label="Materials"
          value={String(materialCount)}
          hint="Published resources"
          icon={FileText}
        />
        <StatCard
          label="Assignments"
          value={String(assignmentCount)}
          hint="Tracked assessments"
          icon={Users}
        />
        <StatCard
          label="Announcements"
          value={String(announcementCount)}
          hint="Published updates"
          icon={Megaphone}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[20rem_1fr]">
        <Panel title="Courses" description="Search by code, title, teacher or department">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses"
              className="pl-9"
            />
          </div>

          <div className="space-y-2">
            {filteredCourses.map((course) => {
              const active = selectedCourse?.id === course.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(course.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-all",
                    active
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border hover:border-primary/40 hover:bg-accent/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{course.code}</p>
                      <p className="truncate text-sm font-semibold">{course.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{course.teacherName}</p>
                    </div>
                    <Badge variant="outline">{course.departmentCode}</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-semibold text-foreground">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <ProgressBar value={course.progressPercent} />
                  </div>
                </button>
              );
            })}
            {filteredCourses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                No courses match your search.
              </div>
            )}
          </div>
        </Panel>

        {selectedCourse && (
          <div className="space-y-4">
            <Panel>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{selectedCourse.code}</Badge>
                    <Badge variant="outline">{selectedCourse.departmentName}</Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">
                    {selectedCourse.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedCourse.teacherName} · {selectedCourse.enrollmentCount} students
                    {selectedCourse.nextSessionAt
                      ? ` · Next session ${new Date(selectedCourse.nextSessionAt).toLocaleString()}`
                      : ""}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
                  <div className="rounded-2xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Coverage</p>
                    <p className="mt-1 text-lg font-semibold">{selectedCourse.progressPercent}%</p>
                  </div>
                  <div className="rounded-2xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Enrollments</p>
                    <p className="mt-1 text-lg font-semibold">{selectedCourse.enrollmentCount}</p>
                  </div>
                  <div className="rounded-2xl border border-border p-3">
                    <p className="text-xs text-muted-foreground">Assignments</p>
                    <p className="mt-1 text-lg font-semibold">{assignmentCount}</p>
                  </div>
                </div>
              </div>
            </Panel>

            <Tabs defaultValue="materials">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>

              <TabsContent value="materials">
                <Panel
                  title="Study materials"
                  description="Centralized access to course learning resources."
                >
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {(materialsQuery.data ?? []).map((material) => (
                      <div key={material.id} className="rounded-2xl border border-border p-4">
                        <div className="flex items-center justify-between gap-3">
                          <Badge variant="outline">{material.material_type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(material.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-medium">{material.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {material.description ?? "No description"}
                        </p>
                        {material.external_url ? (
                          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                            <a href={material.external_url} target="_blank" rel="noreferrer">
                              Open resource
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="mt-4 w-full" disabled>
                            Resource unavailable
                          </Button>
                        )}
                      </div>
                    ))}
                    {(materialsQuery.data ?? []).length === 0 && (
                      <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                        No materials published yet.
                      </div>
                    )}
                  </div>
                </Panel>
              </TabsContent>

              <TabsContent value="assignments">
                <Panel
                  title="Assignments"
                  description="Track due work, submissions and grading status."
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="py-2 font-medium">Assignment</th>
                          <th className="py-2 font-medium">Due</th>
                          <th className="py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(assignmentsQuery.data ?? []).map((assignment) => {
                          const status = assignment.submission?.status ?? assignment.status;
                          return (
                            <tr
                              key={assignment.id}
                              className="border-b border-border/60 last:border-0"
                            >
                              <td className="py-3 font-medium">{assignment.title}</td>
                              <td className="py-3 text-muted-foreground">
                                {assignment.due_at
                                  ? new Date(assignment.due_at).toLocaleDateString()
                                  : "No due date"}
                              </td>
                              <td className="py-3">
                                <Badge
                                  variant={
                                    status === "pending" || status === "published"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {String(status).replace("_", " ")}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                        {(assignmentsQuery.data ?? []).length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="py-6 text-center text-sm text-muted-foreground"
                            >
                              No assignments available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </TabsContent>

              <TabsContent value="quizzes">
                <Panel title="Quizzes" description="Short assessments linked to live course data.">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {(quizzesQuery.data ?? []).map((quiz) => {
                      const state = quiz.attempt?.status ?? quiz.status;
                      return (
                        <div key={quiz.id} className="rounded-2xl border border-border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">{quiz.title}</p>
                            <Badge variant={state === "open" ? "default" : "outline"}>
                              {state}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {quiz.question_count} questions
                          </p>
                        </div>
                      );
                    })}
                    {(quizzesQuery.data ?? []).length === 0 && (
                      <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                        No quizzes available.
                      </div>
                    )}
                  </div>
                </Panel>
              </TabsContent>

              <TabsContent value="announcements">
                <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
                  <Panel
                    title="Recent announcements"
                    description="Important updates shared with this course."
                  >
                    <ul className="space-y-3">
                      {(announcementsQuery.data ?? []).map((item) => (
                        <li key={item.id} className="rounded-2xl border border-border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium">{item.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.published_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                        </li>
                      ))}
                      {(announcementsQuery.data ?? []).length === 0 && (
                        <li className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                          No announcements posted yet.
                        </li>
                      )}
                    </ul>
                  </Panel>

                  <Panel
                    title={
                      role === "teacher" || role === "admin" || role === "super_admin"
                        ? "Post update"
                        : "Stay informed"
                    }
                    description={
                      role === "teacher" || role === "admin" || role === "super_admin"
                        ? "Broadcast reminders, schedule changes and course notices."
                        : "Announcements help you avoid missed deadlines and room changes."
                    }
                  >
                    {role === "teacher" || role === "admin" || role === "super_admin" ? (
                      <form
                        className="space-y-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          postAnnouncementMutation.mutate();
                        }}
                      >
                        <Textarea
                          value={announcement}
                          onChange={(event) => setAnnouncement(event.target.value)}
                          placeholder="Share a quick class update"
                          className="min-h-32"
                        />
                        <Button
                          type="submit"
                          variant="hero"
                          className="w-full"
                          disabled={!announcement.trim() || postAnnouncementMutation.isPending}
                        >
                          <Megaphone className="h-4 w-4" /> Post announcement
                        </Button>
                      </form>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                        You’ll see deadline reminders, room changes and teacher updates for your
                        selected course here.
                      </div>
                    )}
                  </Panel>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
