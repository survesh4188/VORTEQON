import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEFAULT_TEAM, loadTeam, resetTeam, saveTeam, type TeamMember } from "@/lib/team";
import { DEFAULT_PROJECTS, loadProjects, resetProjects, saveProjects, type Project } from "@/lib/projects";
import { DEFAULT_PASSWORD, fileToCompressedDataURL, getPassword, isAuthed, setPassword, signIn, signOut } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Vorteqon" },
      { name: "description", content: "Edit Vorteqon team profiles and projects." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(isAuthed());
  }, []);

  if (!authed) {
    return (
      <div className="admin-shell">
        <div className="admin-login">
          <p className="admin-eyebrow">Vorteqon · Admin</p>
          <h1 className="admin-title">Sign in</h1>
          <p className="admin-sub">Enter the admin password to edit the site.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (signIn(pw)) {
                setAuthed(true);
                setErr(null);
                setPw("");
              } else {
                setErr("Incorrect password.");
              }
            }}
          >
            <label className="admin-field">
              <span>Password</span>
              <input
                type="password"
                value={pw}
                autoFocus
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            {err && <div className="admin-flash danger">{err}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button type="submit" className="admin-btn primary solid">Unlock</button>
              <Link to="/" className="admin-btn ghost">← Back to site</Link>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, opacity: 0.6 }}>
              Default password: <code>{DEFAULT_PASSWORD}</code> — change it from the dashboard after signing in.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onSignOut={() => { signOut(); setAuthed(false); }} />;
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [tab, setTab] = useState<"team" | "projects" | "security">("team");
  const [newPw, setNewPw] = useState("");

  useEffect(() => {
    setTeam(loadTeam());
    setProjects(loadProjects());
  }, []);

  if (!team || !projects) {
    return <div className="admin-shell"><p style={{ color: "var(--text)" }}>Loading…</p></div>;
  }

  // ----- team helpers -----
  const updateMember = (id: string, patch: Partial<TeamMember>) =>
    setTeam((p) => (p ? p.map((m) => (m.id === id ? { ...m, ...patch } : m)) : p));
  const moveMember = (id: string, dir: -1 | 1) =>
    setTeam((p) => {
      if (!p) return p;
      const i = p.findIndex((m) => m.id === id); const j = i + dir;
      if (i < 0 || j < 0 || j >= p.length) return p;
      const next = p.slice(); [next[i], next[j]] = [next[j], next[i]]; return next;
    });
  const removeMember = (id: string) =>
    setTeam((p) => (p ? p.filter((m) => m.id !== id) : p));
  const addMember = () =>
    setTeam((p) => [...(p ?? []), { id: makeId(), initials: "NW", name: "New Member", role: "Role", bio: "Short bio.", link: "#" }]);

  const handleImage = async (id: string, file: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataURL(file);
      updateMember(id, { image: dataUrl });
    } catch {
      setFlash("Could not read image.");
    }
  };

  // ----- project helpers -----
  const updateProject = (id: string, patch: Partial<Project>) =>
    setProjects((p) => (p ? p.map((m) => (m.id === id ? { ...m, ...patch } : m)) : p));
  const moveProject = (id: string, dir: -1 | 1) =>
    setProjects((p) => {
      if (!p) return p;
      const i = p.findIndex((m) => m.id === id); const j = i + dir;
      if (i < 0 || j < 0 || j >= p.length) return p;
      const next = p.slice(); [next[i], next[j]] = [next[j], next[i]]; return next;
    });
  const removeProject = (id: string) =>
    setProjects((p) => (p ? p.filter((m) => m.id !== id) : p));
  const addProject = () =>
    setProjects((p) => [...(p ?? []), { id: makeId(), status: "dev", icon: "🚀", title: "New Project", desc: "Short description.", tag: "Category", progress: "10%" }]);

  // ----- save / reset -----
  const handleSave = () => {
    try {
      saveTeam(team);
      saveProjects(projects);
      setSavedAt(Date.now());
      setFlash(null);
    } catch {
      setFlash("Save failed — storage may be full. Try smaller images.");
    }
  };
  const handleReset = () => {
    if (!window.confirm("Reset all team & project changes to defaults?")) return;
    resetTeam(); resetProjects();
    setTeam(DEFAULT_TEAM); setProjects(DEFAULT_PROJECTS);
    setSavedAt(Date.now());
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Vorteqon · Admin</p>
          <h1 className="admin-title">Site Dashboard</h1>
          <p className="admin-sub">Edit team profiles and projects shown on the homepage. Saved to this browser.</p>
        </div>
        <div className="admin-actions">
          <Link to="/" className="admin-btn ghost">← Back to site</Link>
          <button type="button" className="admin-btn ghost" onClick={onSignOut}>Sign out</button>
          <button type="button" className="admin-btn ghost" onClick={handleReset}>Reset</button>
          <button type="button" className="admin-btn primary solid" onClick={handleSave}>Save changes</button>
        </div>
      </header>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "team" ? "active" : ""}`} onClick={() => setTab("team")}>Team ({team.length})</button>
        <button className={`admin-tab ${tab === "projects" ? "active" : ""}`} onClick={() => setTab("projects")}>Projects ({projects.length})</button>
        <button className={`admin-tab ${tab === "security" ? "active" : ""}`} onClick={() => setTab("security")}>Security</button>
      </div>

      {savedAt && <div className="admin-flash">Saved · {new Date(savedAt).toLocaleTimeString()}</div>}
      {flash && <div className="admin-flash danger">{flash}</div>}

      {tab === "team" && (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn primary" onClick={addMember}>+ Add member</button>
          </div>
          <div className="admin-grid">
            {team.map((m, idx) => (
              <article key={m.id} className="admin-card">
                <div className="admin-card-top">
                  <div
                    className="admin-avatar"
                    style={m.image ? { backgroundImage: `url(${m.image})`, backgroundSize: "cover", backgroundPosition: "center", color: "transparent" } : undefined}
                  >
                    {m.initials || "??"}
                  </div>
                  <div className="admin-card-meta">
                    <span className="admin-tag">#{idx + 1}</span>
                    <div className="admin-reorder">
                      <button type="button" onClick={() => moveMember(m.id, -1)} disabled={idx === 0} aria-label="Move up">↑</button>
                      <button type="button" onClick={() => moveMember(m.id, 1)} disabled={idx === team.length - 1} aria-label="Move down">↓</button>
                    </div>
                  </div>
                </div>

                <label className="admin-field">
                  <span>Profile image</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImage(m.id, e.target.files?.[0] ?? null)} />
                </label>
                {m.image && (
                  <button type="button" className="admin-btn ghost" style={{ alignSelf: "flex-start" }} onClick={() => updateMember(m.id, { image: undefined })}>
                    Remove image
                  </button>
                )}

                <label className="admin-field">
                  <span>Name</span>
                  <input value={m.name} onChange={(e) => updateMember(m.id, { name: e.target.value })} />
                </label>

                <div className="admin-row">
                  <label className="admin-field">
                    <span>Initials (fallback)</span>
                    <input maxLength={3} value={m.initials} onChange={(e) => updateMember(m.id, { initials: e.target.value.toUpperCase() })} />
                  </label>
                  <label className="admin-field">
                    <span>Role</span>
                    <input value={m.role} onChange={(e) => updateMember(m.id, { role: e.target.value })} />
                  </label>
                </div>

                <label className="admin-field">
                  <span>Bio</span>
                  <textarea rows={3} value={m.bio} onChange={(e) => updateMember(m.id, { bio: e.target.value })} />
                </label>

                <label className="admin-field">
                  <span>LinkedIn URL</span>
                  <input value={m.link} onChange={(e) => updateMember(m.id, { link: e.target.value })} placeholder="https://linkedin.com/in/…" />
                </label>

                <div className="admin-card-foot">
                  <button type="button" className="admin-btn danger" onClick={() => removeMember(m.id)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "projects" && (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn primary" onClick={addProject}>+ Add project</button>
          </div>
          <div className="admin-grid">
            {projects.map((p, idx) => (
              <article key={p.id} className="admin-card">
                <div className="admin-card-top">
                  <div className="admin-avatar" style={{ fontSize: 28 }}>{p.icon || "•"}</div>
                  <div className="admin-card-meta">
                    <span className="admin-tag">#{idx + 1}</span>
                    <div className="admin-reorder">
                      <button type="button" onClick={() => moveProject(p.id, -1)} disabled={idx === 0} aria-label="Move up">↑</button>
                      <button type="button" onClick={() => moveProject(p.id, 1)} disabled={idx === projects.length - 1} aria-label="Move down">↓</button>
                    </div>
                  </div>
                </div>

                <label className="admin-field">
                  <span>Title</span>
                  <input value={p.title} onChange={(e) => updateProject(p.id, { title: e.target.value })} />
                </label>

                <div className="admin-row">
                  <label className="admin-field">
                    <span>Icon (emoji)</span>
                    <input value={p.icon} onChange={(e) => updateProject(p.id, { icon: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span>Status</span>
                    <select value={p.status} onChange={(e) => updateProject(p.id, { status: e.target.value as Project["status"] })}>
                      <option value="dev">In Dev</option>
                      <option value="live">Live</option>
                    </select>
                  </label>
                </div>

                <label className="admin-field">
                  <span>Description</span>
                  <textarea rows={3} value={p.desc} onChange={(e) => updateProject(p.id, { desc: e.target.value })} />
                </label>

                <div className="admin-row">
                  <label className="admin-field">
                    <span>Tag</span>
                    <input value={p.tag} onChange={(e) => updateProject(p.id, { tag: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span>Progress (e.g. 75%)</span>
                    <input value={p.progress} onChange={(e) => updateProject(p.id, { progress: e.target.value })} />
                  </label>
                </div>

                <div className="admin-card-foot">
                  <button type="button" className="admin-btn danger" onClick={() => removeProject(p.id)}>Remove</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "security" && (
        <div className="admin-grid" style={{ gridTemplateColumns: "minmax(0,520px)" }}>
          <article className="admin-card">
            <h3 style={{ color: "var(--text)", marginTop: 0 }}>Change admin password</h3>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 0 }}>
              Current password: <code>{getPassword()}</code><br />
              Note: this is a client-side gate stored in this browser only — useful for casual protection, not a real security boundary.
            </p>
            <label className="admin-field">
              <span>New password</span>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 6 characters" />
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="admin-btn primary solid"
                onClick={() => {
                  if (newPw.length < 6) { setFlash("Password must be at least 6 characters."); return; }
                  setPassword(newPw); setNewPw(""); setFlash(null); setSavedAt(Date.now());
                }}
              >
                Update password
              </button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
