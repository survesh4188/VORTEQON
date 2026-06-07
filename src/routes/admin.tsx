import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEFAULT_TEAM, loadTeam, resetTeam, saveTeam, type TeamMember } from "@/lib/team";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Vorteqon" },
      { name: "description", content: "Edit Vorteqon team profiles." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function AdminPage() {
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setTeam(loadTeam());
  }, []);

  if (!team) {
    return <div className="admin-shell"><p style={{ color: "var(--text)" }}>Loading…</p></div>;
  }

  const update = (id: string, patch: Partial<TeamMember>) => {
    setTeam((prev) => (prev ? prev.map((m) => (m.id === id ? { ...m, ...patch } : m)) : prev));
  };

  const move = (id: string, dir: -1 | 1) => {
    setTeam((prev) => {
      if (!prev) return prev;
      const i = prev.findIndex((m) => m.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const remove = (id: string) => {
    setTeam((prev) => (prev ? prev.filter((m) => m.id !== id) : prev));
  };

  const add = () => {
    setTeam((prev) => [
      ...(prev ?? []),
      { id: makeId(), initials: "NW", name: "New Member", role: "Role", bio: "Short bio.", link: "#" },
    ]);
  };

  const handleSave = () => {
    if (!team) return;
    saveTeam(team);
    setSavedAt(Date.now());
  };

  const handleReset = () => {
    if (!window.confirm("Reset team to defaults? Your edits will be lost.")) return;
    resetTeam();
    setTeam(DEFAULT_TEAM);
    setSavedAt(Date.now());
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Vorteqon · Admin</p>
          <h1 className="admin-title">Team Profiles</h1>
          <p className="admin-sub">
            Edit the team members shown on the homepage. Changes are saved to this browser.
          </p>
        </div>
        <div className="admin-actions">
          <Link to="/" className="admin-btn ghost">← Back to site</Link>
          <button type="button" className="admin-btn ghost" onClick={handleReset}>Reset</button>
          <button type="button" className="admin-btn primary" onClick={add}>+ Add member</button>
          <button type="button" className="admin-btn primary solid" onClick={handleSave}>Save changes</button>
        </div>
      </header>

      {savedAt && (
        <div className="admin-flash">Saved · {new Date(savedAt).toLocaleTimeString()}</div>
      )}

      <div className="admin-grid">
        {team.map((m, idx) => (
          <article key={m.id} className="admin-card">
            <div className="admin-card-top">
              <div className="admin-avatar">{m.initials || "??"}</div>
              <div className="admin-card-meta">
                <span className="admin-tag">#{idx + 1}</span>
                <div className="admin-reorder">
                  <button type="button" onClick={() => move(m.id, -1)} disabled={idx === 0} aria-label="Move up">↑</button>
                  <button type="button" onClick={() => move(m.id, 1)} disabled={idx === team.length - 1} aria-label="Move down">↓</button>
                </div>
              </div>
            </div>

            <label className="admin-field">
              <span>Name</span>
              <input value={m.name} onChange={(e) => update(m.id, { name: e.target.value })} />
            </label>

            <div className="admin-row">
              <label className="admin-field">
                <span>Initials</span>
                <input maxLength={3} value={m.initials} onChange={(e) => update(m.id, { initials: e.target.value.toUpperCase() })} />
              </label>
              <label className="admin-field">
                <span>Role</span>
                <input value={m.role} onChange={(e) => update(m.id, { role: e.target.value })} />
              </label>
            </div>

            <label className="admin-field">
              <span>Bio</span>
              <textarea rows={3} value={m.bio} onChange={(e) => update(m.id, { bio: e.target.value })} />
            </label>

            <label className="admin-field">
              <span>LinkedIn URL</span>
              <input value={m.link} onChange={(e) => update(m.id, { link: e.target.value })} placeholder="https://linkedin.com/in/…" />
            </label>

            <div className="admin-card-foot">
              <button type="button" className="admin-btn danger" onClick={() => remove(m.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
