import type { AppRole } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as {
  from: typeof supabase.from;
};

type CourseRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  teacher_id: string | null;
  progress_percent: number;
  next_session_at: string | null;
  departments?: { name?: string; code?: string } | null;
  profiles?: { full_name?: string } | null;
  course_enrollments?: Array<unknown> | null;
};

type EnrollmentIdRow = { course_id: string };
type ParentLinkRow = { student_user_id: string };
type AssignmentSubmissionRow = {
  assignment_id: string;
  status: string;
  score: number | null;
  submitted_at: string | null;
};
type QuizAttemptRow = {
  quiz_id: string;
  status: string;
  score: number | null;
  submitted_at: string | null;
};
type AttendanceRecordRow = {
  id: string;
  status: string;
  marked_at: string;
  attendance_sessions?: {
    session_date?: string;
    topic?: string | null;
    courses?: { title?: string; code?: string } | null;
  } | null;
};
type RegisterEnrollmentRow = {
  student_user_id: string;
  profiles?: { full_name?: string; email?: string | null } | null;
};
type MessageThreadRow = {
  id: string;
  subject: string | null;
  thread_type: string;
  updated_at: string;
};
type MessageRow = {
  id: string;
  body: string;
  sender_user_id: string;
  sent_at: string;
};

type ResultRow = {
  id: string;
  score: number;
  grade: string | null;
  published_at: string | null;
  remarks?: string | null;
  assessments?: {
    title?: string;
    assessment_type?: string;
    assessment_date?: string | null;
    max_score?: number;
    courses?: { title?: string; code?: string } | null;
  } | null;
};

export type CourseWorkspace = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  departmentName: string;
  departmentCode: string;
  teacherId: string | null;
  teacherName: string;
  progressPercent: number;
  nextSessionAt: string | null;
  enrollmentCount: number;
};

export type AttendanceRegisterStudent = {
  userId: string;
  fullName: string;
  email: string | null;
  status: string | null;
};

export type AttendanceHistoryRecord = AttendanceRecordRow;
export type AssessmentResult = ResultRow;
export type MessageThread = MessageThreadRow;
export type ChatMessage = MessageRow;

function formatSupabaseError(error: { message: string }) {
  throw new Error(error.message);
}

export async function getAccessibleCourses(
  userId: string,
  role: AppRole,
): Promise<CourseWorkspace[]> {
  let query = db
    .from("courses")
    .select(
      `
      id,
      code,
      title,
      description,
      teacher_id,
      progress_percent,
      next_session_at,
      departments:department_id(name, code),
      profiles:teacher_id(full_name),
      course_enrollments(count)
    `,
    )
    .order("title");

  if (role === "teacher") {
    query = query.eq("teacher_id", userId);
  }

  if (role === "student") {
    const { data: enrollments, error: enrollmentError } = await supabase
      .from("course_enrollments")
      .select("course_id")
      .eq("student_user_id", userId)
      .eq("status", "active");

    if (enrollmentError) formatSupabaseError(enrollmentError);
    const courseIds = ((enrollments ?? []) as EnrollmentIdRow[]).map((item) => item.course_id);
    if (courseIds.length === 0) return [];
    query = query.in("id", courseIds);
  }

  if (role === "parent") {
    const { data: links, error: linkError } = await supabase
      .from("parent_student_links")
      .select("student_user_id")
      .eq("parent_user_id", userId);
    if (linkError) formatSupabaseError(linkError);
    const studentIds = ((links ?? []) as ParentLinkRow[]).map((item) => item.student_user_id);
    if (studentIds.length === 0) return [];

    const { data: enrollments, error: enrollmentError } = await supabase
      .from("course_enrollments")
      .select("course_id")
      .in("student_user_id", studentIds)
      .eq("status", "active");
    if (enrollmentError) formatSupabaseError(enrollmentError);

    const courseIds = [
      ...new Set(((enrollments ?? []) as EnrollmentIdRow[]).map((item) => item.course_id)),
    ];
    if (courseIds.length === 0) return [];
    query = query.in("id", courseIds);
  }

  const { data, error } = await query;
  if (error) formatSupabaseError(error);

  return ((data ?? []) as unknown as CourseRow[]).map((course) => ({
    id: course.id,
    code: course.code,
    title: course.title,
    description: course.description,
    departmentName: course.departments?.name ?? "Unknown department",
    departmentCode: course.departments?.code ?? "—",
    teacherId: course.teacher_id,
    teacherName: course.profiles?.full_name ?? "Unassigned",
    progressPercent: course.progress_percent ?? 0,
    nextSessionAt: course.next_session_at,
    enrollmentCount: Array.isArray(course.course_enrollments)
      ? course.course_enrollments.length
      : 0,
  }));
}

export async function getCourseMaterials(courseId: string) {
  const { data, error } = await supabase
    .from("course_materials")
    .select(
      "id, title, description, material_type, storage_path, external_url, updated_at, created_at",
    )
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("updated_at", { ascending: false });
  if (error) formatSupabaseError(error);
  return data ?? [];
}

export async function getCourseAssignments(courseId: string, userId: string, role: AppRole) {
  const { data: assignments, error } = await supabase
    .from("assignments")
    .select("id, title, description, due_at, status, max_score")
    .eq("course_id", courseId)
    .order("due_at", { ascending: true });
  if (error) formatSupabaseError(error);

  if (role === "student" || role === "parent") {
    const { data: submissions, error: submissionError } = await supabase
      .from("assignment_submissions")
      .select("assignment_id, status, score, submitted_at")
      .eq("student_user_id", userId);
    if (submissionError) formatSupabaseError(submissionError);
    const submissionMap = new Map(
      ((submissions ?? []) as AssignmentSubmissionRow[]).map((item) => [item.assignment_id, item]),
    );
    return (assignments ?? []).map((assignment) => ({
      ...assignment,
      submission: submissionMap.get(assignment.id) ?? null,
    }));
  }

  return assignments ?? [];
}

export async function getCourseQuizzes(courseId: string, userId: string, role: AppRole) {
  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select("id, title, description, question_count, status, open_at, close_at")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) formatSupabaseError(error);

  if (role === "student" || role === "parent") {
    const { data: attempts, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select("quiz_id, status, score, submitted_at")
      .eq("student_user_id", userId);
    if (attemptError) formatSupabaseError(attemptError);
    const attemptMap = new Map(
      ((attempts ?? []) as QuizAttemptRow[]).map((item) => [item.quiz_id, item]),
    );
    return (quizzes ?? []).map((quiz) => ({
      ...quiz,
      attempt: attemptMap.get(quiz.id) ?? null,
    }));
  }

  return quizzes ?? [];
}

export async function getCourseAnnouncements(courseId: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, body, audience_type, audience_role, published_at")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) formatSupabaseError(error);
  return data ?? [];
}

export async function postCourseAnnouncement(
  courseId: string,
  userId: string,
  title: string,
  body: string,
) {
  const { error } = await supabase.from("announcements").insert({
    course_id: courseId,
    title,
    body,
    audience_type: "course",
    posted_by: userId,
  });
  if (error) formatSupabaseError(error);
}

export async function getResultsForUser(
  userId: string,
  role: AppRole,
): Promise<AssessmentResult[]> {
  if (role === "teacher" || role === "admin" || role === "super_admin") {
    const { data, error } = await supabase
      .from("assessment_results")
      .select(
        `
        id,
        score,
        grade,
        published_at,
        student_user_id,
        assessments:assessment_id(title, assessment_type, assessment_date, max_score, courses:course_id(title, code))
      `,
      )
      .order("published_at", { ascending: false });
    if (error) formatSupabaseError(error);
    return (data ?? []) as AssessmentResult[];
  }

  const { data, error } = await supabase
    .from("assessment_results")
    .select(
      `
      id,
      score,
      grade,
      remarks,
      published_at,
      assessments:assessment_id(title, assessment_type, assessment_date, max_score, courses:course_id(title, code))
    `,
    )
    .eq("student_user_id", userId)
    .order("published_at", { ascending: false });
  if (error) formatSupabaseError(error);
  return (data ?? []) as AssessmentResult[];
}

export async function getAttendanceForUser(userId: string, role: AppRole) {
  if (role === "teacher") {
    const { data: courses, error: courseError } = await supabase
      .from("courses")
      .select("id, title, code")
      .eq("teacher_id", userId);
    if (courseError) formatSupabaseError(courseError);
    return { courses: courses ?? [] };
  }

  const { data, error } = await supabase
    .from("attendance_records")
    .select(
      `
      id,
      status,
      marked_at,
      attendance_sessions:session_id(session_date, topic, courses:course_id(title, code))
    `,
    )
    .eq("student_user_id", userId)
    .order("marked_at", { ascending: false });
  if (error) formatSupabaseError(error);
  return { records: (data ?? []) as AttendanceHistoryRecord[] };
}

export async function getRegisterForCourse(courseId: string, onDate: string) {
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("student_user_id, profiles:student_user_id(full_name, email)")
    .eq("course_id", courseId)
    .eq("status", "active");
  if (enrollmentError) formatSupabaseError(enrollmentError);

  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .select("id, course_id, session_date")
    .eq("course_id", courseId)
    .eq("session_date", onDate)
    .maybeSingle();
  if (sessionError) formatSupabaseError(sessionError);

  let recordMap = new Map<string, string>();
  if (session?.id) {
    const { data: records, error: recordsError } = await supabase
      .from("attendance_records")
      .select("student_user_id, status")
      .eq("session_id", session.id);
    if (recordsError) formatSupabaseError(recordsError);
    recordMap = new Map((records ?? []).map((item) => [item.student_user_id, item.status]));
  }

  return {
    session,
    roster: ((enrollments ?? []) as RegisterEnrollmentRow[]).map((item) => ({
      userId: item.student_user_id,
      fullName: item.profiles?.full_name ?? "Student",
      email: item.profiles?.email ?? null,
      status: recordMap.get(item.student_user_id) ?? null,
    })) as AttendanceRegisterStudent[],
  };
}

export async function saveAttendanceRegister(
  courseId: string,
  teacherId: string,
  onDate: string,
  marks: Record<string, string>,
) {
  let sessionId: string;

  const { data: existingSession, error: existingError } = await supabase
    .from("attendance_sessions")
    .select("id")
    .eq("course_id", courseId)
    .eq("session_date", onDate)
    .maybeSingle();
  if (existingError) formatSupabaseError(existingError);

  if (existingSession?.id) {
    sessionId = existingSession.id;
  } else {
    const { data: createdSession, error: createError } = await supabase
      .from("attendance_sessions")
      .insert({
        course_id: courseId,
        session_date: onDate,
        marked_by: teacherId,
        status: "finalized",
      })
      .select("id")
      .single();
    if (createError) formatSupabaseError(createError);
    if (!createdSession) throw new Error("Failed to create attendance session.");
    sessionId = createdSession.id;
  }

  const payload = Object.entries(marks).map(([student_user_id, status]) => ({
    session_id: sessionId,
    student_user_id,
    status,
  }));

  if (payload.length === 0) return;

  const { error } = await supabase.from("attendance_records").upsert(payload, {
    onConflict: "session_id,student_user_id",
  });
  if (error) formatSupabaseError(error);
}

export async function getMessageThreads(userId: string): Promise<MessageThread[]> {
  const { data: participants, error: participantError } = await supabase
    .from("message_thread_participants")
    .select("thread_id")
    .eq("user_id", userId);
  if (participantError) formatSupabaseError(participantError);

  const threadIds = (participants ?? []).map((item) => item.thread_id);
  if (threadIds.length === 0) return [];

  const { data, error } = await supabase
    .from("message_threads")
    .select("id, subject, thread_type, updated_at")
    .in("id", threadIds)
    .order("updated_at", { ascending: false });
  if (error) formatSupabaseError(error);
  return (data ?? []) as MessageThread[];
}

export async function getMessages(threadId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, body, sender_user_id, sent_at")
    .eq("thread_id", threadId)
    .order("sent_at", { ascending: true });
  if (error) formatSupabaseError(error);
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(threadId: string, senderUserId: string, body: string) {
  const { error } = await supabase.from("messages").insert({
    thread_id: threadId,
    sender_user_id: senderUserId,
    body,
  });
  if (error) formatSupabaseError(error);
}
