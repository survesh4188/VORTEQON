export type TeamMember = {
  id: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  link: string;
};

export const DEFAULT_TEAM: TeamMember[] = [
  { id: "bs", initials: "BS", name: "Bhuvan Shankar R", role: "Founder & CEO", bio: "Teenage software developer and visionary entrepreneur who built Vorteqon to engineer real-world impact through technology.", link: "https://www.linkedin.com/in/bhuvan-shankar-18a15a304" },
  { id: "va", initials: "VA", name: "Vasanthan", role: "MD", bio: "Strategic Managing Director driving vision, capital alignment, and long-term execution at Vorteqon.", link: "https://www.linkedin.com/in/vasanthananbu" },
  { id: "su", initials: "SU", name: "Surveshwar", role: "COO", bio: "Operations-focused COO architecting scalable systems and ensuring disciplined, outcome-driven delivery.", link: "https://www.linkedin.com/in/surveshwar-t-3355b530b" },
  { id: "am", initials: "AM", name: "Amizhthan", role: "Developer", bio: "Core Software Developer engineering robust, production-grade solutions that power Vorteqon's products.", link: "https://www.linkedin.com/in/amizhthan-a-0083a1319/" },
  { id: "hp", initials: "HP", name: "Hariprasath", role: "Developer", bio: "Aspiring Developer building high-performance, user-centric technology with clean, scalable architecture.", link: "https://www.linkedin.com/in/hari-prasath-167846389" },
  { id: "sb", initials: "SB", name: "Sivabalan", role: "3D/2D Animator", bio: "Creative animator shaping visually immersive and fluid experiences for Vorteqon's products.", link: "#" },
  { id: "vw", initials: "VW", name: "Vaitheeshwaran", role: "Tester", bio: "Diligent QA and tester ensuring precision and flawless performance across all Vorteqon solutions.", link: "https://www.linkedin.com/in/vaitheeswaran-v-110a48313" },
  { id: "vg", initials: "VG", name: "Vignesh", role: "Developer", bio: "Passionate software developer contributing to scalable backend systems and high-end core operations.", link: "https://www.linkedin.com/in/vignesh-r-878776365" },
];

const KEY = "vorteqon.team.v1";

export function loadTeam(): TeamMember[] {
  if (typeof window === "undefined") return DEFAULT_TEAM;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_TEAM;
    const parsed = JSON.parse(raw) as TeamMember[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_TEAM;
  } catch {
    return DEFAULT_TEAM;
  }
}

export function saveTeam(team: TeamMember[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(team));
}

export function resetTeam() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
