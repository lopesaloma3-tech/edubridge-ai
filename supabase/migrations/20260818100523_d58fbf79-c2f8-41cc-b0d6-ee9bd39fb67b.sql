-- Academic core schema for EduBridge
-- Covers departments, terms, subjects, courses, enrollments, materials,
-- assignments, quizzes, attendance, results, announcements, notifications,
-- and messaging.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  description text,
  head_user_id uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academic_terms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  academic_year text not null,
  start_date date not null,
  end_date date not null,
  is_current boolean not null default false,
  status text not null default 'active' check (status in ('planned','active','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, academic_year)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  code text not null unique,
  name text not null,
  description text,
  credits numeric(5,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  department_id uuid not null references public.departments(id) on delete cascade,
  term_id uuid not null references public.academic_terms(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  teacher_id uuid references public.profiles(id) on delete set null,
  status text not null default 'active' check (status in ('draft','active','completed','archived')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  next_session_at timestamptz,
  delivery_mode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (term_id, code)
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  student_number text unique,
  department_id uuid references public.departments(id) on delete set null,
  current_term_id uuid references public.academic_terms(id) on delete set null,
  date_of_birth date,
  admission_date date,
  status text not null default 'active' check (status in ('active','graduated','suspended','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  employee_number text unique,
  department_id uuid references public.departments(id) on delete set null,
  designation text,
  status text not null default 'active' check (status in ('active','inactive','on_leave')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references public.profiles(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  relationship text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parent_user_id, student_user_id)
);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active','completed','dropped')),
  final_score numeric(5,2),
  final_grade text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, student_user_id)
);

create table if not exists public.course_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  material_type text not null check (material_type in ('pdf','slides','video','worksheet','link','other')),
  storage_path text,
  external_url text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  is_published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  instructions text,
  due_at timestamptz,
  max_score numeric(6,2),
  status text not null default 'draft' check (status in ('draft','published','closed')),
  created_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  submission_text text,
  storage_path text,
  submitted_at timestamptz,
  status text not null default 'pending' check (status in ('pending','submitted','late','graded','missing')),
  score numeric(6,2),
  feedback text,
  graded_by uuid references public.profiles(id) on delete set null,
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_user_id)
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  question_count integer not null default 0,
  max_score numeric(6,2),
  open_at timestamptz,
  close_at timestamptz,
  status text not null default 'draft' check (status in ('draft','scheduled','open','closed','completed')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  attempt_no integer not null default 1,
  score numeric(6,2),
  started_at timestamptz,
  submitted_at timestamptz,
  status text not null default 'started' check (status in ('started','submitted','graded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quiz_id, student_user_id, attempt_no)
);

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  session_date date not null,
  started_at timestamptz,
  ended_at timestamptz,
  marked_by uuid references public.profiles(id) on delete set null,
  topic text,
  status text not null default 'open' check (status in ('open','finalized')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, session_date)
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'present' check (status in ('present','absent','late','excused')),
  marked_at timestamptz not null default now(),
  remark text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, student_user_id)
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  assessment_type text not null check (assessment_type in ('assignment','quiz','exam','midterm','final','practical','other')),
  term_id uuid references public.academic_terms(id) on delete set null,
  max_score numeric(6,2) not null,
  weight_percent numeric(5,2),
  assessment_date date,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  score numeric(6,2) not null,
  grade text,
  remarks text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, student_user_id)
);

create table if not exists public.term_results (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  term_id uuid not null references public.academic_terms(id) on delete cascade,
  aggregate_score numeric(6,2),
  final_grade text,
  gpa_points numeric(4,2),
  rank_in_course integer,
  credits_earned numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_user_id, course_id, term_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  department_id uuid references public.departments(id) on delete cascade,
  title text not null,
  body text not null,
  audience_type text not null default 'course' check (audience_type in ('course','department','institution','role')),
  audience_role public.app_role,
  posted_by uuid references public.profiles(id) on delete set null,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  body text not null,
  source_table text,
  source_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fee_invoices (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references public.profiles(id) on delete cascade,
  invoice_number text not null unique,
  label text not null,
  amount numeric(10,2) not null,
  due_date date not null,
  status text not null default 'due' check (status in ('paid','due','overdue','upcoming')),
  receipt_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  sender text not null check (sender in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  notification_event_id uuid not null references public.notification_events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz,
  delivered_at timestamptz,
  channel text not null default 'in_app',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (notification_event_id, user_id)
);

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  subject text,
  thread_type text not null default 'direct' check (thread_type in ('direct','group','support')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_thread_participants (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (thread_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  sent_at timestamptz not null default now(),
  edited_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_adminish(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role in ('admin','super_admin')
  );
$$;

create or replace function public.is_teacher_of_course(_user_id uuid, _course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.courses
    where id = _course_id and teacher_id = _user_id
  );
$$;

create or replace function public.is_enrolled_in_course(_user_id uuid, _course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_enrollments
    where course_id = _course_id and student_user_id = _user_id and status = 'active'
  );
$$;

create or replace function public.is_parent_of_student(_parent_user_id uuid, _student_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.parent_student_links
    where parent_user_id = _parent_user_id and student_user_id = _student_user_id
  );
$$;

create or replace function public.can_access_course(_user_id uuid, _course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_adminish(_user_id)
    or public.is_teacher_of_course(_user_id, _course_id)
    or public.is_enrolled_in_course(_user_id, _course_id);
$$;

create or replace function public.can_access_student(_viewer_id uuid, _student_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_adminish(_viewer_id)
    or _viewer_id = _student_user_id
    or public.is_parent_of_student(_viewer_id, _student_user_id)
    or exists (
      select 1
      from public.course_enrollments ce
      join public.courses c on c.id = ce.course_id
      where ce.student_user_id = _student_user_id
        and c.teacher_id = _viewer_id
    );
$$;

alter table public.departments enable row level security;
alter table public.academic_terms enable row level security;
alter table public.subjects enable row level security;
alter table public.courses enable row level security;
alter table public.student_profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.parent_student_links enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.course_materials enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_results enable row level security;
alter table public.term_results enable row level security;
alter table public.announcements enable row level security;
alter table public.notification_events enable row level security;
alter table public.fee_invoices enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.user_notifications enable row level security;
alter table public.message_threads enable row level security;
alter table public.message_thread_participants enable row level security;
alter table public.messages enable row level security;

grant select on public.departments, public.academic_terms, public.subjects to authenticated;
grant select on public.courses, public.course_materials, public.assignments, public.quizzes, public.announcements to authenticated;
grant select, insert, update on public.course_enrollments, public.assignment_submissions, public.quiz_attempts, public.attendance_sessions, public.attendance_records, public.assessments, public.assessment_results, public.term_results, public.notification_events, public.user_notifications, public.message_threads, public.message_thread_participants, public.messages, public.student_profiles, public.teacher_profiles, public.parent_student_links, public.fee_invoices, public.ai_conversations, public.ai_messages to authenticated;
grant all on all tables in schema public to service_role;

create policy "departments_read_authenticated" on public.departments
for select to authenticated using (true);

create policy "academic_terms_read_authenticated" on public.academic_terms
for select to authenticated using (true);

create policy "subjects_read_authenticated" on public.subjects
for select to authenticated using (true);

create policy "courses_read_accessible" on public.courses
for select to authenticated using (public.can_access_course(auth.uid(), id) or public.is_adminish(auth.uid()));
create policy "courses_manage_admin_or_teacher" on public.courses
for all to authenticated using (public.is_adminish(auth.uid()) or teacher_id = auth.uid())
with check (public.is_adminish(auth.uid()) or teacher_id = auth.uid());

create policy "student_profiles_read_accessible" on public.student_profiles
for select to authenticated using (public.can_access_student(auth.uid(), user_id));
create policy "student_profiles_manage_admin" on public.student_profiles
for all to authenticated using (public.is_adminish(auth.uid())) with check (public.is_adminish(auth.uid()));

create policy "teacher_profiles_read_authenticated" on public.teacher_profiles
for select to authenticated using (true);
create policy "teacher_profiles_manage_admin" on public.teacher_profiles
for all to authenticated using (public.is_adminish(auth.uid())) with check (public.is_adminish(auth.uid()));

create policy "parent_links_read_self_or_admin" on public.parent_student_links
for select to authenticated using (parent_user_id = auth.uid() or public.is_adminish(auth.uid()));
create policy "parent_links_manage_admin" on public.parent_student_links
for all to authenticated using (public.is_adminish(auth.uid())) with check (public.is_adminish(auth.uid()));

create policy "course_enrollments_read_accessible" on public.course_enrollments
for select to authenticated using (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or public.is_teacher_of_course(auth.uid(), course_id)
  or public.is_parent_of_student(auth.uid(), student_user_id)
);
create policy "course_enrollments_manage_admin_or_teacher" on public.course_enrollments
for all to authenticated using (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id))
with check (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id));

create policy "course_materials_read_accessible" on public.course_materials
for select to authenticated using (public.can_access_course(auth.uid(), course_id) or public.is_adminish(auth.uid()));
create policy "course_materials_manage_admin_or_teacher" on public.course_materials
for all to authenticated using (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id))
with check (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id));

create policy "assignments_read_accessible" on public.assignments
for select to authenticated using (public.can_access_course(auth.uid(), course_id) or public.is_adminish(auth.uid()));
create policy "assignments_manage_admin_or_teacher" on public.assignments
for all to authenticated using (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id))
with check (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id));

create policy "assignment_submissions_read_accessible" on public.assignment_submissions
for select to authenticated using (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or exists (
    select 1 from public.assignments a
    where a.id = assignment_id and public.is_teacher_of_course(auth.uid(), a.course_id)
  )
  or public.is_parent_of_student(auth.uid(), student_user_id)
);
create policy "assignment_submissions_insert_student" on public.assignment_submissions
for insert to authenticated with check (student_user_id = auth.uid());
create policy "assignment_submissions_update_accessible" on public.assignment_submissions
for update to authenticated using (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or exists (
    select 1 from public.assignments a
    where a.id = assignment_id and public.is_teacher_of_course(auth.uid(), a.course_id)
  )
) with check (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or exists (
    select 1 from public.assignments a
    where a.id = assignment_id and public.is_teacher_of_course(auth.uid(), a.course_id)
  )
);

create policy "quizzes_read_accessible" on public.quizzes
for select to authenticated using (public.can_access_course(auth.uid(), course_id) or public.is_adminish(auth.uid()));
create policy "quizzes_manage_admin_or_teacher" on public.quizzes
for all to authenticated using (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id))
with check (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id));

create policy "quiz_attempts_read_accessible" on public.quiz_attempts
for select to authenticated using (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or exists (
    select 1 from public.quizzes q
    where q.id = quiz_id and public.is_teacher_of_course(auth.uid(), q.course_id)
  )
  or public.is_parent_of_student(auth.uid(), student_user_id)
);
create policy "quiz_attempts_insert_student" on public.quiz_attempts
for insert to authenticated with check (student_user_id = auth.uid());
create policy "quiz_attempts_update_accessible" on public.quiz_attempts
for update to authenticated using (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or exists (
    select 1 from public.quizzes q
    where q.id = quiz_id and public.is_teacher_of_course(auth.uid(), q.course_id)
  )
) with check (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or exists (
    select 1 from public.quizzes q
    where q.id = quiz_id and public.is_teacher_of_course(auth.uid(), q.course_id)
  )
);

create policy "attendance_sessions_read_accessible" on public.attendance_sessions
for select to authenticated using (public.can_access_course(auth.uid(), course_id) or public.is_adminish(auth.uid()));
create policy "attendance_sessions_manage_admin_or_teacher" on public.attendance_sessions
for all to authenticated using (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id))
with check (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id));

create policy "attendance_records_read_accessible" on public.attendance_records
for select to authenticated using (
  public.can_access_student(auth.uid(), student_user_id)
  or exists (
    select 1 from public.attendance_sessions s
    where s.id = session_id and public.is_teacher_of_course(auth.uid(), s.course_id)
  )
);
create policy "attendance_records_manage_admin_or_teacher" on public.attendance_records
for all to authenticated using (
  public.is_adminish(auth.uid())
  or exists (
    select 1 from public.attendance_sessions s
    where s.id = session_id and public.is_teacher_of_course(auth.uid(), s.course_id)
  )
) with check (
  public.is_adminish(auth.uid())
  or exists (
    select 1 from public.attendance_sessions s
    where s.id = session_id and public.is_teacher_of_course(auth.uid(), s.course_id)
  )
);

create policy "assessments_read_accessible" on public.assessments
for select to authenticated using (public.can_access_course(auth.uid(), course_id) or public.is_adminish(auth.uid()));
create policy "assessments_manage_admin_or_teacher" on public.assessments
for all to authenticated using (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id))
with check (public.is_adminish(auth.uid()) or public.is_teacher_of_course(auth.uid(), course_id));

create policy "assessment_results_read_accessible" on public.assessment_results
for select to authenticated using (public.can_access_student(auth.uid(), student_user_id));
create policy "assessment_results_manage_admin_or_teacher" on public.assessment_results
for all to authenticated using (
  public.is_adminish(auth.uid())
  or exists (
    select 1
    from public.assessments a
    where a.id = assessment_id and public.is_teacher_of_course(auth.uid(), a.course_id)
  )
) with check (
  public.is_adminish(auth.uid())
  or exists (
    select 1
    from public.assessments a
    where a.id = assessment_id and public.is_teacher_of_course(auth.uid(), a.course_id)
  )
);

create policy "term_results_read_accessible" on public.term_results
for select to authenticated using (public.can_access_student(auth.uid(), student_user_id));
create policy "term_results_manage_admin_or_teacher" on public.term_results
for all to authenticated using (
  public.is_adminish(auth.uid())
  or exists (
    select 1 from public.courses c where c.id = course_id and c.teacher_id = auth.uid()
  )
) with check (
  public.is_adminish(auth.uid())
  or exists (
    select 1 from public.courses c where c.id = course_id and c.teacher_id = auth.uid()
  )
);

create policy "announcements_read_accessible" on public.announcements
for select to authenticated using (
  public.is_adminish(auth.uid())
  or (course_id is not null and public.can_access_course(auth.uid(), course_id))
  or audience_type = 'institution'
  or (audience_type = 'role' and public.has_role(auth.uid(), audience_role))
);
create policy "announcements_manage_admin_or_teacher" on public.announcements
for all to authenticated using (
  public.is_adminish(auth.uid())
  or (course_id is not null and public.is_teacher_of_course(auth.uid(), course_id))
) with check (
  public.is_adminish(auth.uid())
  or (course_id is not null and public.is_teacher_of_course(auth.uid(), course_id))
);

create policy "notification_events_manage_admin" on public.notification_events
for all to authenticated using (public.is_adminish(auth.uid())) with check (public.is_adminish(auth.uid()));
create policy "notification_events_read_admin" on public.notification_events
for select to authenticated using (public.is_adminish(auth.uid()));

create policy "fee_invoices_read_accessible" on public.fee_invoices
for select to authenticated using (
  student_user_id = auth.uid()
  or public.is_adminish(auth.uid())
  or public.is_parent_of_student(auth.uid(), student_user_id)
);
create policy "fee_invoices_manage_admin" on public.fee_invoices
for all to authenticated using (public.is_adminish(auth.uid())) with check (public.is_adminish(auth.uid()));

create policy "ai_conversations_read_own" on public.ai_conversations
for select to authenticated using (user_id = auth.uid());
create policy "ai_conversations_insert_own" on public.ai_conversations
for insert to authenticated with check (user_id = auth.uid());
create policy "ai_conversations_update_own" on public.ai_conversations
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "ai_messages_read_own_conversations" on public.ai_messages
for select to authenticated using (
  exists (
    select 1 from public.ai_conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);
create policy "ai_messages_insert_own_conversations" on public.ai_messages
for insert to authenticated with check (
  exists (
    select 1 from public.ai_conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

create policy "user_notifications_read_own" on public.user_notifications
for select to authenticated using (user_id = auth.uid() or public.is_adminish(auth.uid()));
create policy "user_notifications_manage_own_or_admin" on public.user_notifications
for all to authenticated using (user_id = auth.uid() or public.is_adminish(auth.uid()))
with check (user_id = auth.uid() or public.is_adminish(auth.uid()));

create policy "message_threads_read_participants" on public.message_threads
for select to authenticated using (
  exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = id and p.user_id = auth.uid()
  ) or public.is_adminish(auth.uid())
);
create policy "message_threads_manage_authenticated" on public.message_threads
for insert to authenticated with check (created_by = auth.uid() or created_by is null);
create policy "message_threads_update_admin" on public.message_threads
for update to authenticated using (public.is_adminish(auth.uid())) with check (public.is_adminish(auth.uid()));

create policy "message_thread_participants_read_participants" on public.message_thread_participants
for select to authenticated using (user_id = auth.uid() or public.is_adminish(auth.uid()));
create policy "message_thread_participants_manage_participants_or_admin" on public.message_thread_participants
for all to authenticated using (user_id = auth.uid() or public.is_adminish(auth.uid()))
with check (user_id = auth.uid() or public.is_adminish(auth.uid()));

create policy "messages_read_participants" on public.messages
for select to authenticated using (
  exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = messages.thread_id and p.user_id = auth.uid()
  ) or public.is_adminish(auth.uid())
);
create policy "messages_insert_participant" on public.messages
for insert to authenticated with check (
  sender_user_id = auth.uid()
  and exists (
    select 1 from public.message_thread_participants p
    where p.thread_id = messages.thread_id and p.user_id = auth.uid()
  )
);
create policy "messages_update_sender_or_admin" on public.messages
for update to authenticated using (sender_user_id = auth.uid() or public.is_adminish(auth.uid()))
with check (sender_user_id = auth.uid() or public.is_adminish(auth.uid()));

create index if not exists idx_courses_teacher_id on public.courses(teacher_id);
create index if not exists idx_courses_department_id on public.courses(department_id);
create index if not exists idx_course_enrollments_student on public.course_enrollments(student_user_id);
create index if not exists idx_course_materials_course on public.course_materials(course_id);
create index if not exists idx_assignments_course on public.assignments(course_id);
create index if not exists idx_assignment_submissions_student on public.assignment_submissions(student_user_id);
create index if not exists idx_quizzes_course on public.quizzes(course_id);
create index if not exists idx_quiz_attempts_student on public.quiz_attempts(student_user_id);
create index if not exists idx_attendance_sessions_course_date on public.attendance_sessions(course_id, session_date desc);
create index if not exists idx_attendance_records_student on public.attendance_records(student_user_id);
create index if not exists idx_assessment_results_student on public.assessment_results(student_user_id);
create index if not exists idx_term_results_student on public.term_results(student_user_id);
create index if not exists idx_announcements_course on public.announcements(course_id, published_at desc);
create index if not exists idx_user_notifications_user on public.user_notifications(user_id, created_at desc);
create index if not exists idx_fee_invoices_student on public.fee_invoices(student_user_id, due_date desc);
create index if not exists idx_ai_conversations_user on public.ai_conversations(user_id, updated_at desc);
create index if not exists idx_ai_messages_conversation on public.ai_messages(conversation_id, created_at);
create index if not exists idx_messages_thread_sent on public.messages(thread_id, sent_at);

create trigger departments_set_updated_at before update on public.departments for each row execute function public.set_updated_at();
create trigger academic_terms_set_updated_at before update on public.academic_terms for each row execute function public.set_updated_at();
create trigger subjects_set_updated_at before update on public.subjects for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger student_profiles_set_updated_at before update on public.student_profiles for each row execute function public.set_updated_at();
create trigger teacher_profiles_set_updated_at before update on public.teacher_profiles for each row execute function public.set_updated_at();
create trigger parent_student_links_set_updated_at before update on public.parent_student_links for each row execute function public.set_updated_at();
create trigger course_enrollments_set_updated_at before update on public.course_enrollments for each row execute function public.set_updated_at();
create trigger course_materials_set_updated_at before update on public.course_materials for each row execute function public.set_updated_at();
create trigger assignments_set_updated_at before update on public.assignments for each row execute function public.set_updated_at();
create trigger assignment_submissions_set_updated_at before update on public.assignment_submissions for each row execute function public.set_updated_at();
create trigger quizzes_set_updated_at before update on public.quizzes for each row execute function public.set_updated_at();
create trigger quiz_attempts_set_updated_at before update on public.quiz_attempts for each row execute function public.set_updated_at();
create trigger attendance_sessions_set_updated_at before update on public.attendance_sessions for each row execute function public.set_updated_at();
create trigger attendance_records_set_updated_at before update on public.attendance_records for each row execute function public.set_updated_at();
create trigger assessments_set_updated_at before update on public.assessments for each row execute function public.set_updated_at();
create trigger assessment_results_set_updated_at before update on public.assessment_results for each row execute function public.set_updated_at();
create trigger term_results_set_updated_at before update on public.term_results for each row execute function public.set_updated_at();
create trigger announcements_set_updated_at before update on public.announcements for each row execute function public.set_updated_at();
create trigger notification_events_set_updated_at before update on public.notification_events for each row execute function public.set_updated_at();
create trigger fee_invoices_set_updated_at before update on public.fee_invoices for each row execute function public.set_updated_at();
create trigger ai_conversations_set_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();
create trigger user_notifications_set_updated_at before update on public.user_notifications for each row execute function public.set_updated_at();
create trigger message_threads_set_updated_at before update on public.message_threads for each row execute function public.set_updated_at();
create trigger message_thread_participants_set_updated_at before update on public.message_thread_participants for each row execute function public.set_updated_at();
create trigger messages_set_updated_at before update on public.messages for each row execute function public.set_updated_at();

-- Access rules for the super-admin tables added previously
create policy "system_settings_modify_super_admin" on public.system_settings for all to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));
create policy "audit_log_select_super_admin" on public.admin_audit_log for select to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));
create policy "audit_log_insert_super_admin" on public.admin_audit_log for insert to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));
create policy "profiles_select_super_admin" on public.profiles for select to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));
create policy "profiles_update_super_admin" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));
create policy "user_roles_select_super_admin" on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));
create policy "user_roles_insert_super_admin" on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));
create policy "user_roles_update_super_admin" on public.user_roles for update to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));
create policy "user_roles_delete_super_admin" on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));
grant insert, update, delete on public.user_roles to authenticated;