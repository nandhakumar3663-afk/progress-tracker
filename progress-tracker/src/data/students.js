export const STUDENTS = [
  { id: "7376251cs307", displayName: "Nandha Kumar PS" },
  { id: "7376251cs329", displayName: "Pavithran S" },
  { id: "7376251cs247", displayName: "Kavinesh D" },
  { id: "7376251cs110", displayName: "Akash J" },
  { id: "7376251cs167", displayName: "Dhinesh R" },
  { id: "7376251cs185", displayName: "Gokul BJ" },
  { id: "7376251cs196", displayName: "Haffiza S" },
  { id: "7376251cs254", displayName: "Keerthana R" },
  { id: "7376251cs353", displayName: "Rahul S" },
  { id: "7376251cs372", displayName: "Ronisha K" },
  { id: "7376251cs443", displayName: "Tamizhoviyan S" },
];

export const SKILLS = [
  { key: "c", label: "C programming", max: 6 },
  { key: "html", label: "HTML", max: 1 },
  { key: "git", label: "Git Hub", max: 1 },
  { key: "js", label: "Java Script", max: 1 },
  { key: "react", label: "React", max: 1 },
  { key: "node", label: "Node JS", max: 1 },
  { key: "linux", label: "Linux", max: 2 },
  { key: "sa", label: "System Administration", max: 2 },
  { key: "cn", label: "Computer Networking", max: 3 },
];

export const DEFAULT_PROGRESS = {
  c: 0,
  html: 0,
  git: 0,
  js: 0,
  react: 0,
  node: 0,
  linux: 0,
  sa: 0,
  cn: 0,
  rp: 0,
  ap: 0,
  skillsCompleted: 0,
};

export function normalizeUserId(id) {
  return String(id || "").trim().toLowerCase();
}

export function getStudentById(id) {
  const normalizedId = normalizeUserId(id);
  return STUDENTS.find((student) => student.id === normalizedId);
}

export function getDefaultLeaderboard() {
  return STUDENTS.map((student) => ({
    ...student,
    rewardpoints: 3500,
    activitypoints: 10000,
  }));
}
