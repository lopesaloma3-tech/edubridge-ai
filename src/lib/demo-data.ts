export const attendanceTrend = [
  { m: "Jan", v: 91 },
  { m: "Feb", v: 94 },
  { m: "Mar", v: 89 },
  { m: "Apr", v: 96 },
  { m: "May", v: 93 },
  { m: "Jun", v: 97 },
];

export const gradeTrend = [
  { m: "Jan", v: 76 },
  { m: "Feb", v: 79 },
  { m: "Mar", v: 82 },
  { m: "Apr", v: 81 },
  { m: "May", v: 87 },
  { m: "Jun", v: 91 },
];

export const courses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    teacher: "Dr. N. Okafor",
    progress: 78,
    next: "Calculus III · Mon 9:00",
  },
  { id: 2, name: "Physics", teacher: "Ms. L. Chen", progress: 64, next: "Optics Lab · Tue 11:30" },
  {
    id: 3,
    name: "Computer Science",
    teacher: "Mr. A. Silva",
    progress: 92,
    next: "Data Structures · Wed 14:00",
  },
  {
    id: 4,
    name: "World Literature",
    teacher: "Mrs. P. Kaur",
    progress: 45,
    next: "Essay Workshop · Thu 10:00",
  },
];

export const assignments = [
  {
    id: 1,
    title: "Integration by parts — problem set",
    course: "Mathematics",
    due: "Today",
    status: "Pending",
  },
  { id: 2, title: "Lab report: refraction", course: "Physics", due: "Tomorrow", status: "Draft" },
  {
    id: 3,
    title: "Binary tree traversal",
    course: "Computer Science",
    due: "In 3 days",
    status: "Submitted",
  },
  { id: 4, title: "Comparative essay", course: "Literature", due: "Next week", status: "Pending" },
];

export const results = [
  { subject: "Mathematics", term: "Term 2", score: 92, grade: "A" },
  { subject: "Physics", term: "Term 2", score: 84, grade: "A-" },
  { subject: "Computer Science", term: "Term 2", score: 96, grade: "A+" },
  { subject: "Literature", term: "Term 2", score: 73, grade: "B" },
  { subject: "History", term: "Term 2", score: 79, grade: "B+" },
];

export const fees = [
  { id: "INV-2401", label: "Tuition — Term 2", amount: 1450, due: "12 Mar 2026", status: "Paid" },
  { id: "INV-2402", label: "Lab & materials", amount: 180, due: "02 Apr 2026", status: "Paid" },
  { id: "INV-2403", label: "Tuition — Term 3", amount: 1450, due: "15 Aug 2026", status: "Due" },
  { id: "INV-2404", label: "Excursion fund", amount: 95, due: "01 Sep 2026", status: "Upcoming" },
];

export const conversations = [
  {
    id: 1,
    name: "Dr. N. Okafor",
    role: "Mathematics",
    last: "Great progress on the last problem set!",
    time: "2m",
  },
  {
    id: 2,
    name: "Class 11-B Group",
    role: "Group",
    last: "Lab groups posted for Tuesday.",
    time: "1h",
  },
  {
    id: 3,
    name: "Front Office",
    role: "Administration",
    last: "Your fee receipt is ready.",
    time: "Yesterday",
  },
];

export const attendanceRoster = [
  { id: 1, name: "Aisha Rahman", roll: "11B-01", rate: 97 },
  { id: 2, name: "Daniel Osei", roll: "11B-02", rate: 88 },
  { id: 3, name: "Mei Tanaka", roll: "11B-03", rate: 93 },
  { id: 4, name: "Lucas Moreau", roll: "11B-04", rate: 71 },
  { id: 5, name: "Sara Haddad", roll: "11B-05", rate: 99 },
];

export type CourseMaterial = {
  id: string;
  title: string;
  kind: "PDF" | "Slides" | "Video" | "Worksheet";
  updated: string;
};

export type CourseAssignment = {
  id: string;
  title: string;
  due: string;
  status: "Pending" | "Draft" | "Submitted" | "To grade" | "Published";
};

export type CourseQuiz = {
  id: string;
  title: string;
  questions: number;
  status: "Open" | "Scheduled" | "Completed";
};

export type CourseAnnouncement = {
  id: string;
  title: string;
  audience: string;
  posted: string;
};

export type AcademicWorkspaceCourse = {
  id: string;
  code: string;
  name: string;
  teacher: string;
  department: string;
  progress: number;
  attendanceRate: number;
  nextSession: string;
  students: number;
  materials: CourseMaterial[];
  assignments: CourseAssignment[];
  quizzes: CourseQuiz[];
  announcements: CourseAnnouncement[];
  supportFlag?: string;
};

export const academicWorkspaceCourses: AcademicWorkspaceCourse[] = [
  {
    id: "c-math-301",
    code: "MTH-301",
    name: "Advanced Mathematics",
    teacher: "Dr. N. Okafor",
    department: "Sciences",
    progress: 78,
    attendanceRate: 96,
    nextSession: "Mon 9:00 · Calculus III",
    students: 38,
    supportFlag: "4 students need intervention before Friday's quiz.",
    materials: [
      { id: "m1", title: "Integration by parts notes", kind: "PDF", updated: "Updated 2 days ago" },
      {
        id: "m2",
        title: "Series expansion slide deck",
        kind: "Slides",
        updated: "Updated this week",
      },
      { id: "m3", title: "Worked examples set 5", kind: "Worksheet", updated: "Added today" },
    ],
    assignments: [
      { id: "a1", title: "Problem set 7", due: "Today", status: "Pending" },
      { id: "a2", title: "Weekly reflection", due: "Thu", status: "Draft" },
      { id: "a3", title: "Differentiation challenge", due: "Last week", status: "Submitted" },
    ],
    quizzes: [
      { id: "q1", title: "Calculus checkpoint", questions: 12, status: "Open" },
      { id: "q2", title: "Series recap", questions: 10, status: "Completed" },
    ],
    announcements: [
      { id: "n1", title: "Bring graph paper for Monday", audience: "Class 11-B", posted: "1h ago" },
      {
        id: "n2",
        title: "Office hour moved to 3 PM",
        audience: "All students",
        posted: "Yesterday",
      },
    ],
  },
  {
    id: "c-phy-204",
    code: "PHY-204",
    name: "Physics",
    teacher: "Ms. L. Chen",
    department: "Sciences",
    progress: 64,
    attendanceRate: 93,
    nextSession: "Tue 11:30 · Optics Lab",
    students: 31,
    supportFlag: "Lab reports from 6 students are still missing.",
    materials: [
      { id: "m4", title: "Refraction lab guide", kind: "PDF", updated: "Updated yesterday" },
      { id: "m5", title: "Wave theory explainer", kind: "Video", updated: "Updated this week" },
    ],
    assignments: [
      { id: "a4", title: "Refraction lab report", due: "Tomorrow", status: "Pending" },
      { id: "a5", title: "Optics worksheet", due: "Mon", status: "Submitted" },
    ],
    quizzes: [
      { id: "q3", title: "Optics warm-up", questions: 8, status: "Scheduled" },
      { id: "q4", title: "Wave motion review", questions: 15, status: "Completed" },
    ],
    announcements: [
      {
        id: "n3",
        title: "Safety goggles required for lab",
        audience: "Physics lab",
        posted: "3h ago",
      },
    ],
  },
  {
    id: "c-cs-220",
    code: "CSC-220",
    name: "Computer Science",
    teacher: "Mr. A. Silva",
    department: "Technology",
    progress: 92,
    attendanceRate: 98,
    nextSession: "Wed 14:00 · Data Structures",
    students: 42,
    materials: [
      { id: "m6", title: "Binary trees cheat sheet", kind: "PDF", updated: "Updated 4 days ago" },
      { id: "m7", title: "Traversal walkthrough", kind: "Video", updated: "Added today" },
      {
        id: "m8",
        title: "Sorting lab starter code",
        kind: "Worksheet",
        updated: "Updated this week",
      },
    ],
    assignments: [
      { id: "a6", title: "Binary tree traversal", due: "In 3 days", status: "Submitted" },
      { id: "a7", title: "Queue implementation", due: "Next week", status: "Pending" },
    ],
    quizzes: [
      { id: "q5", title: "Algorithms speed test", questions: 20, status: "Open" },
      { id: "q6", title: "Pointers refresher", questions: 10, status: "Completed" },
    ],
    announcements: [
      {
        id: "n4",
        title: "Hackathon team sign-up is open",
        audience: "CS department",
        posted: "Today",
      },
    ],
  },
];

export const teacherCourseStats = [
  { label: "Courses managed", value: "5", hint: "Across two departments" },
  { label: "Materials uploaded", value: "18", hint: "This month" },
  { label: "Assignments to grade", value: "23", hint: "Due this week" },
  { label: "At-risk students", value: "7", hint: "Attendance or grade alerts" },
];

export const studentCourseStats = [
  { label: "Enrolled courses", value: "6", hint: "2 with work due this week" },
  { label: "Study materials", value: "27", hint: "Across all subjects" },
  { label: "Open quizzes", value: "3", hint: "1 due today" },
  { label: "Submission rate", value: "92%", hint: "This term" },
];

export const adminCourseStats = [
  { label: "Active courses", value: "42", hint: "12 departments" },
  { label: "Departments", value: "12", hint: "4 new electives pending" },
  { label: "Faculty owners", value: "96", hint: "Course coordinators assigned" },
  { label: "Announcements sent", value: "18", hint: "This week" },
];

export const adminCourseHealth = [
  {
    id: "h1",
    title: "Mathematics department",
    metric: "Content coverage",
    value: "84%",
    note: "3 courses need updated materials before the next review.",
  },
  {
    id: "h2",
    title: "Science labs",
    metric: "Attendance compliance",
    value: "91%",
    note: "2 sections show repeated low attendance on practical days.",
  },
  {
    id: "h3",
    title: "Assessment operations",
    metric: "Results published",
    value: "76%",
    note: "Midterm results for 5 classes are still awaiting release.",
  },
];

export const courseCatalogRequests = [
  {
    id: "r1",
    title: "Robotics Fundamentals",
    owner: "Technology department",
    status: "Pending approval",
  },
  {
    id: "r2",
    title: "Academic Writing Lab",
    owner: "Humanities department",
    status: "Needs timetable slot",
  },
  {
    id: "r3",
    title: "Environmental Systems",
    owner: "Sciences department",
    status: "Faculty assigned",
  },
];
