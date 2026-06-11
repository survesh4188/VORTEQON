export type ProjectStatus = "live" | "dev";

export type Project = {
  id: string;
  status: ProjectStatus;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  progress: string; // e.g. "72%"
};

export const DEFAULT_PROJECTS: Project[] = [
  { id: "quantumos", status: "dev", icon: "⚛️", title: "QuantumOS", desc: "A secure, lightweight operating system engineered for next-gen Android devices. Built for speed and privacy from the ground up.", tag: "OS · Android", progress: "72%" },
  { id: "vkey", status: "dev", icon: "⌨️", title: "V-Key", desc: "A customizable keyboard built for speed, privacy, and a seamless mobile experience. Your words, your rules.", tag: "Mobile · Productivity", progress: "55%" },
  { id: "vortexai", status: "live", icon: "🤖", title: "Vortex AI", desc: "An AI-driven productivity suite designed to empower creators and developers. Smarter tools for a faster world.", tag: "AI · Productivity", progress: "90%" },
];

const KEY = "vorteqon.projects.v1";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROJECTS;
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveProjects(items: Project[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function resetProjects() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
